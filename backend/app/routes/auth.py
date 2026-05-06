from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=schemas.Token)
def signup(user_data: schemas.UserSignup, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pwd,
        role=user_data.role,
        phone=user_data.phone,
        date_of_birth=user_data.date_of_birth,
        profile_image_url=user_data.profile_image_url
    )
    db.add(new_user)
    db.flush()  # Flush to get new_user.id without committing yet
    
    # Create empty profile based on role
    if new_user.role == models.UserRole.DOCTOR:
        new_doctor = models.Doctor(user_id=new_user.id)
        db.add(new_doctor)
    elif new_user.role == models.UserRole.PATIENT:
        new_patient = models.Patient(user_id=new_user.id)
        db.add(new_patient)
    
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/setup-doctor-profile", response_model=schemas.DoctorResponse)
def setup_doctor_profile(
    profile_data: schemas.DoctorSetup,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != models.UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can setup doctor profiles")
    
    doctor = current_user.doctor
    if not doctor:
        doctor = models.Doctor(user_id=current_user.id)
        db.add(doctor)
        db.flush()

    # Update fields
    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(doctor, key, value)
    
    db.commit()
    db.refresh(doctor)
    return doctor

@router.post("/setup-patient-profile", response_model=schemas.PatientResponse)
def setup_patient_profile(
    profile_data: schemas.PatientSetup,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can setup patient profiles")
    
    patient = current_user.patient
    if not patient:
        patient = models.Patient(user_id=current_user.id)
        db.add(patient)
        db.flush()

    # Update fields
    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(patient, key, value)
    
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/me/doctor", response_model=schemas.DoctorResponse)
def get_current_doctor(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    doctor = db.query(models.Doctor).options(joinedload(models.Doctor.user)).filter(models.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return doctor

@router.get("/me/patient", response_model=schemas.PatientResponse)
def get_current_patient(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    patient = db.query(models.Patient).options(joinedload(models.Patient.user)).filter(models.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient
