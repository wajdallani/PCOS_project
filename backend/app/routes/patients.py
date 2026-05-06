from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

@router.get("/{patient_id}/full-details")
def get_patient_full_details(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Security check
    patient = db.query(models.Patient).options(joinedload(models.Patient.user)).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    if current_user.role == models.UserRole.PATIENT:
        if patient.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == models.UserRole.DOCTOR:
        # Find doctor profile
        doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        # Check access
        access = db.query(models.DoctorPatientAccess).filter(
            models.DoctorPatientAccess.doctor_id == doctor.id,
            models.DoctorPatientAccess.patient_id == patient_id,
            models.DoctorPatientAccess.status == models.AccessStatus.ACTIVE
        ).first()
        if not access:
            raise HTTPException(status_code=403, detail="No active access to this patient")
    else:
        raise HTTPException(status_code=403, detail="Role not authorized")

    # Fetch all data
    lab_tests = db.query(models.LabTest).filter(models.LabTest.patient_id == patient_id).order_by(models.LabTest.test_date.desc()).all()
    ultrasounds = db.query(models.Ultrasound).filter(models.Ultrasound.patient_id == patient_id).order_by(models.Ultrasound.ultrasound_date.desc()).all()
    daily_logs = db.query(models.DailyLog).filter(models.DailyLog.patient_id == patient_id).order_by(models.DailyLog.log_date.desc()).all()
    meal_logs = db.query(models.MealLog).filter(models.MealLog.patient_id == patient_id).order_by(models.MealLog.meal_date.desc()).all()
    treatment_plans = db.query(models.TreatmentPlan).filter(models.TreatmentPlan.patient_id == patient_id).order_by(models.TreatmentPlan.created_at.desc()).all()
    model_runs = db.query(models.ModelRun).filter(models.ModelRun.patient_id == patient_id).order_by(models.ModelRun.created_at.desc()).all()

    return {
        "patient": patient,
        "lab_tests": lab_tests,
        "ultrasounds": ultrasounds,
        "daily_logs": daily_logs,
        "meal_logs": meal_logs,
        "treatment_plans": treatment_plans,
        "model_runs": model_runs
    }

@router.get("/{patient_id}/treatment-inputs")
def get_patient_treatment_inputs(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Latest lab test
    latest_lab = db.query(models.LabTest).filter(models.LabTest.patient_id == patient_id).order_by(models.LabTest.test_date.desc()).first()
    
    # Latest ultrasound
    latest_ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.patient_id == patient_id).order_by(models.Ultrasound.ultrasound_date.desc()).first()
    
    return {
        "patient_id": patient.id,
        "FSH/LH": latest_lab.fsh_lh_ratio if latest_lab else None,
        "FSHmIU/mL": latest_lab.fsh if latest_lab else None,
        "LHmIU/mL": latest_lab.lh if latest_lab else None,
        "AMHng/mL": latest_lab.amh if latest_lab else None,
        "BMI": patient.bmi,
        "RBSmg/dl": latest_lab.fasting_glucose if latest_lab else None,
        "Follicle_No._L": latest_ultrasound.follicle_no_l if latest_ultrasound else None,
        "Follicle_No._R": latest_ultrasound.follicle_no_r if latest_ultrasound else None
    }


@router.get("/", response_model=List[schemas.PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(models.Patient).options(joinedload(models.Patient.user)).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).options(joinedload(models.Patient.user)).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/{patient_id}", response_model=schemas.PatientResponse)
def update_patient(patient_id: int, patient_update: schemas.PatientUpdate, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(db_patient)
    db.commit()
    return None
