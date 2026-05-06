from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from typing import Optional
import json
import os
from pathlib import Path
from datetime import datetime, date
from decimal import Decimal
import enum
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

from services.segmentation_service import SegmentationService
from services.tabular_service import TabularService
from services.fusion_service import FusionService
from services.image_service import ImageService

def make_json_serializable(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, enum.Enum):
        return obj.value
    if isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [make_json_serializable(i) for i in obj]
    return obj

router = APIRouter(
    prefix="/pcos",
    tags=["PCOS Prediction"]
)

# Initialize services
seg_service = SegmentationService()
img_service = ImageService()
tab_service = TabularService()

@router.post("/segment")
async def segment_ultrasound(file: UploadFile = File(...)):
    try:
        content = await file.read()
        results = seg_service.process_image(content, file.filename)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-segmentation")
def save_segmentation(
    request: schemas.SaveSegmentationRequest,
    db: Session = Depends(get_db)
):
    ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.id == request.ultrasound_id).first()
    if not ultrasound:
        raise HTTPException(status_code=404, detail="Ultrasound record not found")
    
    side = request.side.lower()
    if side not in ["left", "right"]:
        raise HTTPException(status_code=400, detail="Side must be 'left' or 'right'")
    
    if side == "left":
        ultrasound.left_mask_url = request.mask_url
        ultrasound.left_overlay_url = request.overlay_url
        ultrasound.follicle_no_l = request.follicle_count
    else:
        ultrasound.right_mask_url = request.mask_url
        ultrasound.right_overlay_url = request.overlay_url
        ultrasound.follicle_no_r = request.follicle_count
    
    db.commit()
    db.refresh(ultrasound)
    
    return {
        "message": "Segmentation results saved successfully",
        "ultrasound": ultrasound
    }

@router.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        results = img_service.predict(content)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-tabular")
async def predict_tabular(patient_data: str = Form(...), segmentation_data: str = Form(...)):
    try:
        patient_json = json.loads(patient_data)
        seg_json = json.loads(segmentation_data)
        results = tab_service.predict(patient_json, seg_json)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-full")
async def predict_full(
    request: schemas.PredictFullRequest,
    db: Session = Depends(get_db)
):
    try:
        # 1. Fetch DB Rows
        patient = db.query(models.Patient).filter(models.Patient.id == request.patient_id).first()
        lab_test = db.query(models.LabTest).filter(models.LabTest.id == request.lab_test_id).first()
        daily_log = db.query(models.DailyLog).filter(models.DailyLog.id == request.daily_log_id).first()
        ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.id == request.ultrasound_id).first()

        # 2. Validate existence
        if not patient: raise HTTPException(status_code=404, detail="Patient not found")
        if not lab_test: raise HTTPException(status_code=404, detail="Lab Test not found")
        if not daily_log: raise HTTPException(status_code=404, detail="Daily Log not found")
        if not ultrasound: raise HTTPException(status_code=404, detail="Ultrasound not found")

        # 3. Validate ultrasound data
        if not ultrasound.left_image_url and not ultrasound.right_image_url:
            raise HTTPException(status_code=400, detail="Ultrasound must have at least one image URL")
        
        follicle_no_l = ultrasound.follicle_no_l
        follicle_no_r = ultrasound.follicle_no_r
        if follicle_no_l is None and follicle_no_r is None:
            raise HTTPException(status_code=400, detail="Ultrasound must have follicle counts. Run segmentation first.")

        # 4. Build Model Input Features
        # Mapping DB fields to exact feature names in feature_columns.json
        raw_features = {}
        
        # From Patients
        raw_features["Age (yrs)"] = patient.age_yrs
        raw_features["BMI"] = patient.bmi
        raw_features["Hip(inch)"] = patient.hip_inch
        raw_features["Waist(inch)"] = patient.waist_inch
        
        # From Lab Tests
        raw_features["FSH(mIU/mL)"] = lab_test.fsh
        raw_features["LH(mIU/mL)"] = lab_test.lh
        raw_features["FSH/LH"] = lab_test.fsh_lh_ratio
        raw_features["AMH(ng/mL)"] = lab_test.amh
        raw_features["Vit D3 (ng/mL)"] = lab_test.vitamin_d3
        
        # From Daily Logs
        raw_features["Cycle length(days)"] = daily_log.cycle_length_days
        raw_features["Weight gain(Y/N)"] = daily_log.weight_gain_y_n
        raw_features["hair growth(Y/N)"] = daily_log.hair_growth_y_n
        raw_features["Skin darkening (Y/N)"] = daily_log.skin_darkening_y_n
        raw_features["Hair loss(Y/N)"] = daily_log.hair_loss_y_n
        raw_features["Pimples(Y/N)"] = daily_log.pimples_y_n
        raw_features["Fast food (Y/N)"] = daily_log.fast_food_y_n
        
        # Cycle(R/I) mapping: Irregular (1) -> 4, Regular (0) -> 2
        if daily_log.cycle_irregular is not None:
            raw_features["Cycle(R/I)"] = 4 if daily_log.cycle_irregular == 1 else 2
        else:
            raw_features["Cycle(R/I)"] = None
        
        # From Ultrasounds
        raw_features["Follicle No. (L)"] = follicle_no_l
        raw_features["Follicle No. (R)"] = follicle_no_r

        # Imputation Logic
        defaults = {
            "Age (yrs)": 0.0,
            "BMI": 0.0,
            "Cycle(R/I)": 0.0,
            "Cycle length(days)": 28.0,
            "FSH(mIU/mL)": 0.0,
            "LH(mIU/mL)": 0.0,
            "FSH/LH": 0.0,
            "Hip(inch)": 0.0,
            "Waist(inch)": 0.0,
            "AMH(ng/mL)": 0.0,
            "Vit D3 (ng/mL)": 0.0,
            "Weight gain(Y/N)": 0.0,
            "hair growth(Y/N)": 0.0,
            "Skin darkening (Y/N)": 0.0,
            "Hair loss(Y/N)": 0.0,
            "Pimples(Y/N)": 0.0,
            "Fast food (Y/N)": 0.0,
            "Follicle No. (L)": 0.0,
            "Follicle No. (R)": 0.0
        }

        model_features = {}
        imputed_features = {}

        for feat_name, default_val in defaults.items():
            val = raw_features.get(feat_name)
            
            # Check if value is missing or null-like
            if val is None or val == "" or val == "null":
                model_features[feat_name] = float(default_val)
                imputed_features[feat_name] = {
                    "original": val,
                    "used": float(default_val)
                }
            else:
                try:
                    model_features[feat_name] = float(val)
                except (ValueError, TypeError):
                    model_features[feat_name] = float(default_val)
                    imputed_features[feat_name] = {
                        "original": val,
                        "used": float(default_val)
                    }

        # 5. Tabular Prediction
        try:
            tabular_results = tab_service.predict(model_features, {})
            p_tabular = tabular_results["p_tabular"]
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # 6. Image Prediction
        p_image = 0
        left_p = None
        right_p = None

        if ultrasound.left_image_url:
            res = img_service.predict_from_url(ultrasound.left_image_url)
            left_p = res["p_image"]
        
        if ultrasound.right_image_url:
            res = img_service.predict_from_url(ultrasound.right_image_url)
            right_p = res["p_image"]

        if left_p is not None and right_p is not None:
            p_image = (left_p + right_p) / 2
        elif left_p is not None:
            p_image = left_p
        elif right_p is not None:
            p_image = right_p
        else:
            raise HTTPException(status_code=400, detail="No valid ultrasound image URLs for inference")

        # 7. Fusion & Risk Level
        final_risk = 0.7 * p_tabular + 0.3 * p_image
        
        if final_risk < 0.4:
            risk_level = "Low"
        elif final_risk < 0.7:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        # 8. Persist Model Run
        ultrasound.image_probability = p_image
        
        input_data = {
            "source_ids": {
                "patient_id": request.patient_id,
                "lab_test_id": request.lab_test_id,
                "daily_log_id": request.daily_log_id,
                "ultrasound_id": request.ultrasound_id
            },
            "raw_db_values": {
                "patient": {c.name: getattr(patient, c.name) for c in patient.__table__.columns},
                "lab_test": {c.name: getattr(lab_test, c.name) for c in lab_test.__table__.columns},
                "daily_log": {c.name: getattr(daily_log, c.name) for c in daily_log.__table__.columns},
                "ultrasound": {c.name: getattr(ultrasound, c.name) for c in ultrasound.__table__.columns}
            },
            "model_features": model_features,
            "imputed_features": imputed_features,
            "image_sources": {
                "left_image_url": ultrasound.left_image_url,
                "right_image_url": ultrasound.right_image_url
            },
            "fusion_weights": {
                "tabular": 0.7,
                "image": 0.3
            }
        }
        
        output_data = {
            "p_tabular": p_tabular,
            "p_image": p_image,
            "final_risk": final_risk,
            "risk_level": risk_level,
            "fusion_formula": "0.7 * p_tabular + 0.3 * p_image"
        }
        
        # Sanitize for JSON serialization
        input_data = make_json_serializable(input_data)
        output_data = make_json_serializable(output_data)
        
        db_model_run = models.ModelRun(
            patient_id=request.patient_id,
            doctor_id=ultrasound.doctor_id,
            lab_test_id=request.lab_test_id,
            daily_log_id=request.daily_log_id,
            ultrasounds_id=request.ultrasound_id,
            model_name=models.ModelName.Model_Wajd_DoctorRisk,
            input_data=input_data,
            output_data=output_data
        )
        db.add(db_model_run)
        
        try:
            db.commit()
            db.refresh(db_model_run)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to persist model run: {str(e)}")

        # 9. Return Response
        return {
            "model_run_id": db_model_run.id,
            "inputs_used": {
                "patient_id": request.patient_id,
                "lab_test_id": request.lab_test_id,
                "daily_log_id": request.daily_log_id,
                "ultrasound_id": request.ultrasound_id,
                "model_features": model_features,
                "imputed_features": imputed_features
            },
            "predictions": {
                "p_tabular": p_tabular,
                "p_image": p_image,
                "final_risk": final_risk,
                "risk_level": risk_level
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
