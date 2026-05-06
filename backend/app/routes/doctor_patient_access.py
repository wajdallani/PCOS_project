from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/doctor-patient-access",
    tags=["Doctor Patient Access"]
)

@router.get("/", response_model=List[schemas.DoctorPatientAccessResponse])
def get_access_list(db: Session = Depends(get_db)):
    return db.query(models.DoctorPatientAccess).all()

@router.get("/{access_id}", response_model=schemas.DoctorPatientAccessResponse)
def get_access(access_id: int, db: Session = Depends(get_db)):
    access = db.query(models.DoctorPatientAccess).filter(models.DoctorPatientAccess.id == access_id).first()
    if not access:
        raise HTTPException(status_code=404, detail="Access record not found")
    return access

@router.post("/", response_model=schemas.DoctorPatientAccessResponse)
def create_access(access_data: schemas.DoctorPatientAccessCreate, db: Session = Depends(get_db)):
    # Check if doctor exists
    doctor = db.query(models.Doctor).filter(models.Doctor.id == access_data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if patient exists
    patient = db.query(models.Patient).filter(models.Patient.id == access_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if access already exists
    existing_access = db.query(models.DoctorPatientAccess).filter(
        models.DoctorPatientAccess.doctor_id == access_data.doctor_id,
        models.DoctorPatientAccess.patient_id == access_data.patient_id
    ).first()
    
    if existing_access:
        raise HTTPException(status_code=400, detail="Access record already exists")

    new_access = models.DoctorPatientAccess(**access_data.model_dump())
    db.add(new_access)
    db.commit()
    db.refresh(new_access)
    return new_access

@router.put("/{access_id}", response_model=schemas.DoctorPatientAccessResponse)
def update_access(access_id: int, access_data: schemas.DoctorPatientAccessUpdate, db: Session = Depends(get_db)):
    db_access = db.query(models.DoctorPatientAccess).filter(models.DoctorPatientAccess.id == access_id).first()
    if not db_access:
        raise HTTPException(status_code=404, detail="Access record not found")
    
    for key, value in access_data.model_dump(exclude_unset=True).items():
        setattr(db_access, key, value)
    
    db.commit()
    db.refresh(db_access)
    return db_access

@router.delete("/{access_id}")
def delete_access(access_id: int, db: Session = Depends(get_db)):
    db_access = db.query(models.DoctorPatientAccess).filter(models.DoctorPatientAccess.id == access_id).first()
    if not db_access:
        raise HTTPException(status_code=404, detail="Access record not found")
    
    db.delete(db_access)
    db.commit()
    return {"detail": "Access record deleted"}
