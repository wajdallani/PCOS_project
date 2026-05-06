from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/meal-logs",
    tags=["Meal Logs"]
)

@router.get("/", response_model=List[schemas.MealLogResponse])
def get_meal_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(models.MealLog).offset(skip).limit(limit).all()
    return logs

@router.get("/{meal_log_id}", response_model=schemas.MealLogResponse)
def get_meal_log(meal_log_id: int, db: Session = Depends(get_db)):
    log = db.query(models.MealLog).filter(models.MealLog.id == meal_log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Meal log not found")
    return log

@router.post("/", response_model=schemas.MealLogResponse, status_code=status.HTTP_201_CREATED)
def create_meal_log(log: schemas.MealLogCreate, db: Session = Depends(get_db)):
    db_log = models.MealLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.put("/{meal_log_id}", response_model=schemas.MealLogResponse)
def update_meal_log(meal_log_id: int, log_update: schemas.MealLogUpdate, db: Session = Depends(get_db)):
    db_log = db.query(models.MealLog).filter(models.MealLog.id == meal_log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Meal log not found")
    
    update_data = log_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_log, key, value)
    
    db.commit()
    db.refresh(db_log)
    return db_log

@router.delete("/{meal_log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_log(meal_log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(models.MealLog).filter(models.MealLog.id == meal_log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Meal log not found")
    
    db.delete(db_log)
    db.commit()
    return None
