from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(enum.Enum):
    DOCTOR = "DOCTOR"
    PATIENT = "PATIENT"

class AccessStatus(enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"

class AccessLevel(enum.Enum):
    READ = "READ"
    WRITE = "WRITE"
    MONITORING = "MONITORING"

class PeriodFlow(enum.Enum):
    NONE = "NONE"
    LIGHT = "LIGHT"
    MEDIUM = "MEDIUM"
    HEAVY = "HEAVY"
    SUPER_HEAVY = "SUPER_HEAVY"

class Emotion(enum.Enum):
    STRESS = "STRESS"
    HAPPY = "HAPPY"
    SAD = "SAD"
    ANXIOUS = "ANXIOUS"
    NEUTRAL = "NEUTRAL"
    ANGRY = "ANGRY"

class AcneLevel(enum.Enum):
    CLEAR_SKIN = "CLEAR_SKIN"
    MILD_ACNE = "MILD_ACNE"
    MODERATE_ACNE = "MODERATE_ACNE"
    SEVERE_ACNE = "SEVERE_ACNE"

class MealType(enum.Enum):
    BREAKFAST = "BREAKFAST"
    LUNCH = "LUNCH"
    DINNER = "DINNER"
    SNACK = "SNACK"

class DrugType(enum.Enum):
    METFORMIN = "METFORMIN"
    MYO_INOSITOL = "MYO_INOSITOL"

class TreatmentStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    STOPPED = "STOPPED"

class ModelName(enum.Enum):
    Model_Safa_Emotion = "Model_Safa_Emotion"
    Model_Asma_Acne = "Model_Asma_Acne"
    Model_Mariem_Food = "Model_Mariem_Food"
    Model_Asma_PatientRisk = "Model_Asma_PatientRisk"
    Model_Wajd_DoctorRisk = "Model_Wajd_DoctorRisk"
    Model_Belkis_Treatment = "Model_Belkis_Treatment"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(UserRole), nullable=False)
    phone = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    profile_image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    doctor = relationship("Doctor", back_populates="user", uselist=False)
    patient = relationship("Patient", back_populates="user", uselist=False)

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    specialty = Column(String, nullable=True)
    address = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    cnam = Column(String, nullable=True)
    years_exp = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    # Relationships
    user = relationship("User", back_populates="doctor")
    lab_tests = relationship("LabTest", back_populates="doctor")
    ultrasounds = relationship("Ultrasound", back_populates="doctor")
    treatment_plans = relationship("TreatmentPlan", back_populates="doctor")
    model_runs = relationship("ModelRun", back_populates="doctor")
    patient_accesses = relationship("DoctorPatientAccess", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    age_yrs = Column(Integer, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    marriage_status_yrs = Column(Integer, nullable=True)
    pregnant_y_n = Column(Integer, nullable=True) # 0/1
    no_of_abortions = Column(Integer, nullable=True)
    hip_inch = Column(Float, nullable=True)
    waist_inch = Column(Float, nullable=True)
    waist_hip_ratio = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    # Relationships
    user = relationship("User", back_populates="patient")
    lab_tests = relationship("LabTest", back_populates="patient")
    ultrasounds = relationship("Ultrasound", back_populates="patient")
    daily_logs = relationship("DailyLog", back_populates="patient")
    meal_logs = relationship("MealLog", back_populates="patient")
    treatment_plans = relationship("TreatmentPlan", back_populates="patient")
    model_runs = relationship("ModelRun", back_populates="patient")
    doctor_accesses = relationship("DoctorPatientAccess", back_populates="patient")
    face_images = relationship("FaceImage", back_populates="patient")

class LabTest(Base):
    __tablename__ = "lab_tests"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    test_date = Column(Date, nullable=True)
    fsh = Column(Float, nullable=True)
    lh = Column(Float, nullable=True)
    fsh_lh_ratio = Column(Float, nullable=True)
    lh_fsh_ratio = Column(Float, nullable=True)
    amh = Column(Float, nullable=True)
    vitamin_d3 = Column(Float, nullable=True)
    fasting_glucose = Column(Float, nullable=True)
    insulin = Column(Float, nullable=True)
    original_file_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="lab_tests")
    doctor = relationship("Doctor", back_populates="lab_tests")
    model_runs = relationship("ModelRun", back_populates="lab_test")

class Ultrasound(Base):
    __tablename__ = "ultrasounds"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    ultrasound_date = Column(Date, nullable=True)
    left_image_url = Column(String, nullable=True)
    right_image_url = Column(String, nullable=True)
    left_mask_url = Column(String, nullable=True)
    right_mask_url = Column(String, nullable=True)
    left_overlay_url = Column(String, nullable=True)
    right_overlay_url = Column(String, nullable=True)
    left_gradcam_url = Column(String, nullable=True)
    right_gradcam_url = Column(String, nullable=True)
    follicle_no_l = Column(Integer, nullable=True)
    follicle_no_r = Column(Integer, nullable=True)
    image_probability = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="ultrasounds")
    doctor = relationship("Doctor", back_populates="ultrasounds")
    model_runs = relationship("ModelRun", back_populates="ultrasound")

class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    log_date = Column(Date, nullable=True)
    period_flow = Column(Enum(PeriodFlow), nullable=True)
    cycle_day = Column(Integer, nullable=True)
    cycle_length_days = Column(Integer, nullable=True)
    cycle_irregular = Column(Integer, nullable=True) # 0/1
    current_weight_kg = Column(Float, nullable=True)
    weight_gain_y_n = Column(Integer, nullable=True) # 0/1
    hair_loss_y_n = Column(Integer, nullable=True) # 0/1
    skin_darkening_y_n = Column(Integer, nullable=True) # 0/1
    hair_growth_y_n = Column(Integer, nullable=True) # 0/1
    pimples_y_n = Column(Integer, nullable=True) # 0/1
    fast_food_y_n = Column(Integer, nullable=True) # 0/1
    reg_exercise_y_n = Column(Integer, nullable=True) # 0/1
    hair_growth_areas = Column(JSON, nullable=True)
    exercises = Column(JSON, nullable=True)
    emotion = Column(Enum(Emotion), nullable=True)
    acne_level = Column(Enum(AcneLevel), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="daily_logs")
    meal_logs = relationship("MealLog", back_populates="daily_log")
    model_runs = relationship("ModelRun", back_populates="daily_log")

class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    daily_log_id = Column(Integer, ForeignKey("daily_logs.id"))
    meal_date = Column(Date, nullable=True)
    meal_type = Column(Enum(MealType), nullable=True)
    meal_image_url = Column(String, nullable=True)
    ingredients = Column(JSON, nullable=True)
    nutrition_details = Column(JSON, nullable=True)
    meal_calorie = Column(Float, nullable=True)
    glucose_variation = Column(Float, nullable=True)
    is_fast_food = Column(Integer, nullable=True) # 0/1
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="meal_logs")
    daily_log = relationship("DailyLog", back_populates="meal_logs")

class TreatmentPlan(Base):
    __tablename__ = "treatment_plans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    drug_type = Column(Enum(DrugType), nullable=False)
    drug_type_encoded = Column(Integer, nullable=True)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    status = Column(Enum(TreatmentStatus), nullable=False, default=TreatmentStatus.ACTIVE)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="treatment_plans")
    doctor = relationship("Doctor", back_populates="treatment_plans")
    model_runs = relationship("ModelRun", back_populates="treatment_plan")

class ModelRun(Base):
    __tablename__ = "model_runs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    daily_log_id = Column(Integer, ForeignKey("daily_logs.id"), nullable=True)
    lab_test_id = Column(Integer, ForeignKey("lab_tests.id"), nullable=True)
    ultrasounds_id = Column(Integer, ForeignKey("ultrasounds.id"), nullable=True) # Matches the requested field name pattern or fix it
    treatment_plan_id = Column(Integer, ForeignKey("treatment_plans.id"), nullable=True)
    
    model_name = Column(Enum(ModelName), nullable=False)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="model_runs")
    doctor = relationship("Doctor", back_populates="model_runs")
    daily_log = relationship("DailyLog", back_populates="model_runs")
    lab_test = relationship("LabTest", back_populates="model_runs")
    ultrasound = relationship("Ultrasound", back_populates="model_runs")
    treatment_plan = relationship("TreatmentPlan", back_populates="model_runs")
    face_images = relationship("FaceImage", back_populates="model_run")

class FaceImage(Base):
    __tablename__ = "face_images"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    image_url = Column(String, nullable=False)
    acne_level = Column(Integer, nullable=True)
    acne_label = Column(String, nullable=True)
    model_run_id = Column(Integer, ForeignKey("model_runs.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="face_images")
    model_run = relationship("ModelRun", back_populates="face_images")

class DoctorPatientAccess(Base):
    __tablename__ = "doctor_patient_access"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    status = Column(Enum(AccessStatus), nullable=False, default=AccessStatus.PENDING)
    access_level = Column(Enum(AccessLevel), nullable=False, default=AccessLevel.READ)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    doctor = relationship("Doctor", back_populates="patient_accesses")
    patient = relationship("Patient", back_populates="doctor_accesses")
