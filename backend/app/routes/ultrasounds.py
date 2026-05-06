from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/ultrasounds",
    tags=["Ultrasounds"]
)

@router.post("/from-risk-page", response_model=schemas.UltrasoundResponse)
def save_ultrasound_from_risk_page(
    data: schemas.UltrasoundRiskPage,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Find current doctor
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    new_ultrasound = models.Ultrasound(
        doctor_id=doctor.id,
        **data.model_dump()
    )
    db.add(new_ultrasound)
    db.commit()
    db.refresh(new_ultrasound)
    return new_ultrasound

@router.get("/", response_model=List[schemas.UltrasoundResponse])
def get_ultrasounds(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ultrasounds = db.query(models.Ultrasound).offset(skip).limit(limit).all()
    return ultrasounds

@router.get("/{ultrasound_id}", response_model=schemas.UltrasoundResponse)
def get_ultrasound(ultrasound_id: int, db: Session = Depends(get_db)):
    ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.id == ultrasound_id).first()
    if not ultrasound:
        raise HTTPException(status_code=404, detail="Ultrasound not found")
    return ultrasound

@router.post("/", response_model=schemas.UltrasoundResponse, status_code=status.HTTP_201_CREATED)
def create_ultrasound(ultrasound: schemas.UltrasoundCreate, db: Session = Depends(get_db)):
    db_ultrasound = models.Ultrasound(**ultrasound.model_dump())
    db.add(db_ultrasound)
    db.commit()
    db.refresh(db_ultrasound)
    return db_ultrasound

@router.put("/{ultrasound_id}", response_model=schemas.UltrasoundResponse)
def update_ultrasound(ultrasound_id: int, ultrasound_update: schemas.UltrasoundUpdate, db: Session = Depends(get_db)):
    db_ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.id == ultrasound_id).first()
    if not db_ultrasound:
        raise HTTPException(status_code=404, detail="Ultrasound not found")
    
    update_data = ultrasound_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ultrasound, key, value)
    
    db.commit()
    db.refresh(db_ultrasound)
    return db_ultrasound

@router.delete("/{ultrasound_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ultrasound(ultrasound_id: int, db: Session = Depends(get_db)):
    db_ultrasound = db.query(models.Ultrasound).filter(models.Ultrasound.id == ultrasound_id).first()
    if not db_ultrasound:
        raise HTTPException(status_code=404, detail="Ultrasound not found")
    
    db.delete(db_ultrasound)
    db.commit()
    return None
