from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime, date
from .models import UserRole, PeriodFlow, Emotion, AcneLevel, MealType, DrugType, TreatmentStatus, ModelName, AccessStatus, AccessLevel

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image_url: Optional[str] = None

class UserCreate(UserBase):
    password_hash: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    role: UserRole
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image_url: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UserNestedResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image_url: Optional[str] = None
    role: UserRole
    model_config = ConfigDict(from_attributes=True)

# Doctor Schemas
class DoctorBase(BaseModel):
    user_id: int
    specialty: Optional[str] = None
    address: Optional[str] = None
    license_number: Optional[str] = None
    cnam: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorSetup(BaseModel):
    specialty: Optional[str] = None
    address: Optional[str] = None
    license_number: Optional[str] = None
    cnam: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None

class DoctorUpdate(BaseModel):
    specialty: Optional[str] = None
    address: Optional[str] = None
    license_number: Optional[str] = None
    cnam: Optional[str] = None
    years_exp: Optional[int] = None
    bio: Optional[str] = None

class DoctorResponse(DoctorBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user: Optional[UserNestedResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Patient Schemas
class PatientBase(BaseModel):
    user_id: int
    age_yrs: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    bmi: Optional[float] = None
    marriage_status_yrs: Optional[int] = None
    pregnant_y_n: Optional[int] = None
    no_of_abortions: Optional[int] = None
    hip_inch: Optional[float] = None
    waist_inch: Optional[float] = None
    waist_hip_ratio: Optional[float] = None

class PatientCreate(PatientBase):
    pass

class PatientSetup(BaseModel):
    age_yrs: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    bmi: Optional[float] = None
    marriage_status_yrs: Optional[int] = None
    pregnant_y_n: Optional[int] = None
    no_of_abortions: Optional[int] = None
    hip_inch: Optional[float] = None
    waist_inch: Optional[float] = None
    waist_hip_ratio: Optional[float] = None

class PatientUpdate(BaseModel):
    age_yrs: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    bmi: Optional[float] = None
    marriage_status_yrs: Optional[int] = None
    pregnant_y_n: Optional[int] = None
    no_of_abortions: Optional[int] = None
    hip_inch: Optional[float] = None
    waist_inch: Optional[float] = None
    waist_hip_ratio: Optional[float] = None

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user: Optional[UserNestedResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Lab Test Schemas
class LabTestBase(BaseModel):
    patient_id: int
    doctor_id: int
    test_date: Optional[date] = None
    fsh: Optional[float] = None
    lh: Optional[float] = None
    fsh_lh_ratio: Optional[float] = None
    lh_fsh_ratio: Optional[float] = None
    amh: Optional[float] = None
    vitamin_d3: Optional[float] = None
    fasting_glucose: Optional[float] = None
    insulin: Optional[float] = None
    original_file_url: Optional[str] = None

class LabTestCreate(LabTestBase):
    pass

class LabTestRiskPage(BaseModel):
    patient_id: int
    test_date: Optional[date] = None
    fsh: Optional[float] = None
    lh: Optional[float] = None
    fsh_lh_ratio: Optional[float] = None
    lh_fsh_ratio: Optional[float] = None
    amh: Optional[float] = None
    vitamin_d3: Optional[float] = None
    fasting_glucose: Optional[float] = None
    insulin: Optional[float] = None
    original_file_url: Optional[str] = None

class LabTestUpdate(BaseModel):
    test_date: Optional[date] = None
    fsh: Optional[float] = None
    lh: Optional[float] = None
    fsh_lh_ratio: Optional[float] = None
    lh_fsh_ratio: Optional[float] = None
    amh: Optional[float] = None
    vitamin_d3: Optional[float] = None
    fasting_glucose: Optional[float] = None
    insulin: Optional[float] = None
    original_file_url: Optional[str] = None

class LabTestResponse(LabTestBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Ultrasound Schemas
class UltrasoundBase(BaseModel):
    patient_id: int
    doctor_id: int
    ultrasound_date: Optional[date] = None
    left_image_url: Optional[str] = None
    right_image_url: Optional[str] = None
    left_mask_url: Optional[str] = None
    right_mask_url: Optional[str] = None
    left_gradcam_url: Optional[str] = None
    right_gradcam_url: Optional[str] = None
    follicle_no_l: Optional[int] = None
    follicle_no_r: Optional[int] = None
    image_probability: Optional[float] = None

class UltrasoundCreate(UltrasoundBase):
    pass

class UltrasoundRiskPage(BaseModel):
    patient_id: int
    ultrasound_date: Optional[date] = None
    left_image_url: Optional[str] = None
    right_image_url: Optional[str] = None
    follicle_no_l: Optional[int] = None
    follicle_no_r: Optional[int] = None
    image_probability: Optional[float] = None

class UltrasoundUpdate(BaseModel):
    ultrasound_date: Optional[date] = None
    left_image_url: Optional[str] = None
    right_image_url: Optional[str] = None
    left_mask_url: Optional[str] = None
    right_mask_url: Optional[str] = None
    left_gradcam_url: Optional[str] = None
    right_gradcam_url: Optional[str] = None
    follicle_no_l: Optional[int] = None
    follicle_no_r: Optional[int] = None
    image_probability: Optional[float] = None

class UltrasoundResponse(UltrasoundBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Daily Log Schemas
class DailyLogBase(BaseModel):
    patient_id: int
    log_date: Optional[date] = None
    period_flow: Optional[PeriodFlow] = None
    cycle_day: Optional[int] = None
    cycle_length_days: Optional[int] = None
    cycle_irregular: Optional[int] = None
    current_weight_kg: Optional[float] = None
    weight_gain_y_n: Optional[int] = None
    hair_loss_y_n: Optional[int] = None
    skin_darkening_y_n: Optional[int] = None
    hair_growth_y_n: Optional[int] = None
    pimples_y_n: Optional[int] = None
    fast_food_y_n: Optional[int] = None
    reg_exercise_y_n: Optional[int] = None
    hair_growth_areas: Optional[Any] = None
    exercises: Optional[Any] = None
    emotion: Optional[Emotion] = None
    acne_level: Optional[AcneLevel] = None

class DailyLogCreate(DailyLogBase):
    pass

class DailyLogUpdate(BaseModel):
    log_date: Optional[date] = None
    period_flow: Optional[PeriodFlow] = None
    cycle_day: Optional[int] = None
    cycle_length_days: Optional[int] = None
    cycle_irregular: Optional[int] = None
    current_weight_kg: Optional[float] = None
    weight_gain_y_n: Optional[int] = None
    hair_loss_y_n: Optional[int] = None
    skin_darkening_y_n: Optional[int] = None
    hair_growth_y_n: Optional[int] = None
    pimples_y_n: Optional[int] = None
    fast_food_y_n: Optional[int] = None
    reg_exercise_y_n: Optional[int] = None
    hair_growth_areas: Optional[Any] = None
    exercises: Optional[Any] = None
    emotion: Optional[Emotion] = None
    acne_level: Optional[AcneLevel] = None

class DailyLogResponse(DailyLogBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Meal Log Schemas
class MealLogBase(BaseModel):
    patient_id: int
    daily_log_id: int
    meal_date: Optional[date] = None
    meal_type: Optional[MealType] = None
    meal_image_url: Optional[str] = None
    ingredients: Optional[Any] = None
    nutrition_details: Optional[Any] = None
    meal_calorie: Optional[float] = None
    glucose_variation: Optional[float] = None
    is_fast_food: Optional[int] = None

class MealLogCreate(MealLogBase):
    pass

class MealLogUpdate(BaseModel):
    meal_date: Optional[date] = None
    meal_type: Optional[MealType] = None
    meal_image_url: Optional[str] = None
    ingredients: Optional[Any] = None
    nutrition_details: Optional[Any] = None
    meal_calorie: Optional[float] = None
    glucose_variation: Optional[float] = None
    is_fast_food: Optional[int] = None

class MealLogResponse(MealLogBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Treatment Plan Schemas
class TreatmentPlanBase(BaseModel):
    patient_id: int
    doctor_id: int
    drug_type: DrugType
    drug_type_encoded: Optional[int] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    status: TreatmentStatus
    notes: Optional[str] = None

class TreatmentPlanCreate(TreatmentPlanBase):
    pass

class TreatmentPlanUpdate(BaseModel):
    status: Optional[TreatmentStatus] = None
    notes: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None

class TreatmentPlanResponse(TreatmentPlanBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Model Run Schemas
class ModelRunBase(BaseModel):
    patient_id: int
    doctor_id: Optional[int] = None
    daily_log_id: Optional[int] = None
    lab_test_id: Optional[int] = None
    ultrasounds_id: Optional[int] = None
    treatment_plan_id: Optional[int] = None
    model_name: ModelName
    input_data: Optional[Any] = None
    output_data: Optional[Any] = None

class ModelRunCreate(ModelRunBase):
    pass

class ModelRunUpdate(BaseModel):
    input_data: Optional[Any] = None
    output_data: Optional[Any] = None

class TreatmentResponseRun(BaseModel):
    patient_id: int
    fsh_lh: Optional[float] = Field(None, alias="FSH/LH")
    fsh: Optional[float] = Field(None, alias="FSHmIU/mL")
    lh: Optional[float] = Field(None, alias="LHmIU/mL")
    amh: Optional[float] = Field(None, alias="AMHng/mL")
    bmi: Optional[float] = Field(None, alias="BMI")
    rbs: Optional[float] = Field(None, alias="RBSmg/dl")
    follicle_no_l: Optional[int] = Field(None, alias="Follicle_No._L")
    follicle_no_r: Optional[int] = Field(None, alias="Follicle_No._R")
    
    model_config = ConfigDict(populate_by_name=True)


class FaceImageBase(BaseModel):
    image_url: str
    acne_level: Optional[int] = None
    acne_label: Optional[str] = None
    model_run_id: Optional[int] = None

class FaceImageCreate(FaceImageBase):
    patient_id: int

class FaceImageResponse(FaceImageBase):
    id: int
    patient_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class AcneAnalyzeRequest(BaseModel):
    image_url: str
    acne_level: int

class ModelRunResponse(ModelRunBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Doctor Patient Access Schemas
class DoctorPatientAccessBase(BaseModel):
    doctor_id: int
    patient_id: int
    status: AccessStatus
    access_level: AccessLevel

class DoctorPatientAccessCreate(DoctorPatientAccessBase):
    pass

class DoctorPatientAccessUpdate(BaseModel):
    status: Optional[AccessStatus] = None
    access_level: Optional[AccessLevel] = None

class DoctorPatientAccessResponse(DoctorPatientAccessBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SaveSegmentationRequest(BaseModel):
    ultrasound_id: int
    side: str # 'left' or 'right'
    mask_url: str
    overlay_url: str
    follicle_count: int

class PredictFullRequest(BaseModel):
    patient_id: int
    lab_test_id: int
    daily_log_id: int
    ultrasound_id: int
