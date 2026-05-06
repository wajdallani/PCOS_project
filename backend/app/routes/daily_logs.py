from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/daily-logs",
    tags=["Daily Logs"]
)

@router.get("/", response_model=List[schemas.DailyLogResponse])
def get_daily_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(models.DailyLog).offset(skip).limit(limit).all()
    return logs

@router.get("/{daily_log_id}", response_model=schemas.DailyLogResponse)
def get_daily_log(daily_log_id: int, db: Session = Depends(get_db)):
    log = db.query(models.DailyLog).filter(models.DailyLog.id == daily_log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    return log

@router.post("/", response_model=schemas.DailyLogResponse, status_code=status.HTTP_201_CREATED)
def create_daily_log(log: schemas.DailyLogCreate, db: Session = Depends(get_db)):
    db_log = models.DailyLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.put("/{daily_log_id}", response_model=schemas.DailyLogResponse)
def update_daily_log(daily_log_id: int, log_update: schemas.DailyLogUpdate, db: Session = Depends(get_db)):
    db_log = db.query(models.DailyLog).filter(models.DailyLog.id == daily_log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    
    update_data = log_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_log, key, value)
    
    db.commit()
    db.refresh(db_log)
    return db_log

@router.delete("/{daily_log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_daily_log(daily_log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(models.DailyLog).filter(models.DailyLog.id == daily_log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    
    db.delete(db_log)
    db.commit()
    return None
