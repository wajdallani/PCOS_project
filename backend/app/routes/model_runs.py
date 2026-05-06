from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/model-runs",
    tags=["Model Runs"]
)

@router.post("/treatment-response")
def create_treatment_response_run(
    input_data: schemas.TreatmentResponseRun,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    from ..services.belkis_treatment.treatment_service import treatment_service
    
    # Find doctor
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    # Missing field validation
    required_fields = [
        "FSH/LH", "FSHmIU/mL", "LHmIU/mL", "AMHng/mL", 
        "BMI", "RBSmg/dl", "Follicle_No._L", "Follicle_No._R"
    ]
    # Use model_dump(by_alias=True) to check against the aliases
    data_dict = input_data.model_dump(by_alias=True)
    missing_fields = [f for f in required_fields if data_dict.get(f) is None]
    
    if missing_fields:
        raise HTTPException(
            status_code=400, 
            detail={"missing_fields": missing_fields}
        )

    # Run AI inference
    prediction_result = treatment_service.predict_treatment_response(data_dict)

    
    if "error" in prediction_result and "Model file not available" in prediction_result["error"]:
        # We still save the run even if the model is missing (as a log of the attempt)
        # but return the error as requested or handle gracefully
        pass

    db_run = models.ModelRun(
        patient_id=input_data.patient_id,
        doctor_id=doctor.id,
        model_name=models.ModelName.Model_Belkis_Treatment,
        input_data=data_dict,
        output_data=prediction_result
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    
    return {
        "model_run": db_run,
        "prediction": prediction_result
    }


@router.get("/", response_model=List[schemas.ModelRunResponse])
def get_model_runs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    runs = db.query(models.ModelRun).offset(skip).limit(limit).all()
    return runs

@router.get("/{model_run_id}", response_model=schemas.ModelRunResponse)
def get_model_run(model_run_id: int, db: Session = Depends(get_db)):
    run = db.query(models.ModelRun).filter(models.ModelRun.id == model_run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Model run not found")
    return run

@router.post("/", response_model=schemas.ModelRunResponse, status_code=status.HTTP_201_CREATED)
def create_model_run(run: schemas.ModelRunCreate, db: Session = Depends(get_db)):
    db_run = models.ModelRun(**run.model_dump())
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

@router.put("/{model_run_id}", response_model=schemas.ModelRunResponse)
def update_model_run(model_run_id: int, run_update: schemas.ModelRunUpdate, db: Session = Depends(get_db)):
    db_run = db.query(models.ModelRun).filter(models.ModelRun.id == model_run_id).first()
    if not db_run:
        raise HTTPException(status_code=404, detail="Model run not found")
    
    update_data = run_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_run, key, value)
    
    db.commit()
    db.refresh(db_run)
    return db_run

@router.delete("/{model_run_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model_run(model_run_id: int, db: Session = Depends(get_db)):
    db_run = db.query(models.ModelRun).filter(models.ModelRun.id == model_run_id).first()
    if not db_run:
        raise HTTPException(status_code=404, detail="Model run not found")
    
    db.delete(db_run)
    db.commit()
    return None
