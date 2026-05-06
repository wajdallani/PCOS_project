from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/treatment-plans",
    tags=["Treatment Plans"]
)

@router.get("/", response_model=List[schemas.TreatmentPlanResponse])
def get_treatment_plans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    plans = db.query(models.TreatmentPlan).offset(skip).limit(limit).all()
    return plans

@router.get("/{treatment_plan_id}", response_model=schemas.TreatmentPlanResponse)
def get_treatment_plan(treatment_plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.TreatmentPlan).filter(models.TreatmentPlan.id == treatment_plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")
    return plan

@router.post("/", response_model=schemas.TreatmentPlanResponse, status_code=status.HTTP_201_CREATED)
def create_treatment_plan(plan: schemas.TreatmentPlanCreate, db: Session = Depends(get_db)):
    db_plan = models.TreatmentPlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.put("/{treatment_plan_id}", response_model=schemas.TreatmentPlanResponse)
def update_treatment_plan(treatment_plan_id: int, plan_update: schemas.TreatmentPlanUpdate, db: Session = Depends(get_db)):
    db_plan = db.query(models.TreatmentPlan).filter(models.TreatmentPlan.id == treatment_plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")
    
    update_data = plan_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plan, key, value)
    
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.delete("/{treatment_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_treatment_plan(treatment_plan_id: int, db: Session = Depends(get_db)):
    db_plan = db.query(models.TreatmentPlan).filter(models.TreatmentPlan.id == treatment_plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")
    
    db.delete(db_plan)
    db.commit()
    return None
