from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from ..database import get_db
from .. import models, schemas, auth
from datetime import date

router = APIRouter(
    prefix="/acne",
    tags=["Acne Analysis"]
)

@router.get("/history", response_model=List[schemas.FaceImageResponse])
def get_acne_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    
    history = db.query(models.FaceImage)\
        .filter(models.FaceImage.patient_id == patient.id)\
        .order_by(models.FaceImage.created_at.desc())\
        .all()
    return history

@router.get("/latest")
def get_latest_acne(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    
    latest = db.query(models.FaceImage)\
        .filter(models.FaceImage.patient_id == patient.id)\
        .order_by(models.FaceImage.created_at.desc())\
        .first()
    
    if not latest:
        return None
    
    severity_map = {
        0: 10,
        1: 35,
        2: 75,
        3: 95
    }
    
    return {
        "image_url": latest.image_url,
        "acne_level": latest.acne_level,
        "acne_label": latest.acne_label,
        "severity_percent": severity_map.get(latest.acne_level, 0),
        "created_at": latest.created_at
    }

@router.post("/analyze")
def analyze_acne(
    request: schemas.AcneAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can use this endpoint")

    patient = db.query(models.Patient).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    # Map acne level to label
    level_map = {
        0: "CLEAR_SKIN",
        1: "MILD_ACNE",
        2: "MODERATE_ACNE",
        3: "SEVERE_ACNE"
    }
    label = level_map.get(request.acne_level, "UNKNOWN")

    # 1. Create ModelRun
    db_run = models.ModelRun(
        patient_id=patient.id,
        model_name=models.ModelName.Model_Asma_Acne,
        input_data={"face_image_url": request.image_url},
        output_data={"acne_level": request.acne_level, "acne_label": label}
    )
    db.add(db_run)
    db.flush() # Get ID

    # 2. Create FaceImage
    db_face = models.FaceImage(
        patient_id=patient.id,
        image_url=request.image_url,
        acne_level=request.acne_level,
        acne_label=label,
        model_run_id=db_run.id
    )
    db.add(db_face)

    # 3. Update or create today's daily log
    today = date.today()
    db_log = db.query(models.DailyLog)\
        .filter(models.DailyLog.patient_id == patient.id, models.DailyLog.log_date == today)\
        .first()
    
    pimples_val = 1 if request.acne_level > 0 else 0
    
    if db_log:
        db_log.acne_level = label
        db_log.pimples_y_n = pimples_val
    else:
        db_log = models.DailyLog(
            patient_id=patient.id,
            log_date=today,
            acne_level=label,
            pimples_y_n=pimples_val
        )
        db.add(db_log)

    db.commit()
    db.refresh(db_run)
    db.refresh(db_face)
    db.refresh(db_log)

    return {
        "face_image": db_face,
        "model_run": db_run,
        "daily_log": db_log
    }
