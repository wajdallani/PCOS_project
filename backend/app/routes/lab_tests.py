from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/lab-tests",
    tags=["Lab Tests"]
)

@router.post("/from-risk-page", response_model=schemas.LabTestResponse)
def save_lab_test_from_risk_page(
    data: schemas.LabTestRiskPage,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Find current doctor
    doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    new_test = models.LabTest(
        doctor_id=doctor.id,
        **data.model_dump()
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test

@router.get("/", response_model=List[schemas.LabTestResponse])
def get_lab_tests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tests = db.query(models.LabTest).offset(skip).limit(limit).all()
    return tests

@router.get("/{lab_test_id}", response_model=schemas.LabTestResponse)
def get_lab_test(lab_test_id: int, db: Session = Depends(get_db)):
    test = db.query(models.LabTest).filter(models.LabTest.id == lab_test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Lab test not found")
    return test

@router.post("/", response_model=schemas.LabTestResponse, status_code=status.HTTP_201_CREATED)
def create_lab_test(test: schemas.LabTestCreate, db: Session = Depends(get_db)):
    db_test = models.LabTest(**test.model_dump())
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

@router.put("/{lab_test_id}", response_model=schemas.LabTestResponse)
def update_lab_test(lab_test_id: int, test_update: schemas.LabTestUpdate, db: Session = Depends(get_db)):
    db_test = db.query(models.LabTest).filter(models.LabTest.id == lab_test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Lab test not found")
    
    update_data = test_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_test, key, value)
    
    db.commit()
    db.refresh(db_test)
    return db_test

@router.delete("/{lab_test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab_test(lab_test_id: int, db: Session = Depends(get_db)):
    db_test = db.query(models.LabTest).filter(models.LabTest.id == lab_test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Lab test not found")
    
    db.delete(db_test)
    db.commit()
    return None
