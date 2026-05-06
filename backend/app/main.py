from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routes import patients, users, doctors, lab_tests, ultrasounds, daily_logs, meal_logs, treatment_plans, model_runs, auth, doctor_patient_access, ocr, uploads, acne, prediction, integrated_assistant
from fastapi.staticfiles import StaticFiles
import os


# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="OvaCare API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def health_check():
    return {"status": "healthy", "service": "OvaCare Backend"}

# Include routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(users.router)
app.include_router(doctors.router)
app.include_router(lab_tests.router)
app.include_router(ultrasounds.router)
app.include_router(daily_logs.router)
app.include_router(meal_logs.router)
app.include_router(treatment_plans.router)
app.include_router(model_runs.router)
app.include_router(doctor_patient_access.router)
app.include_router(ocr.router)
app.include_router(uploads.router)
app.include_router(acne.router)
app.include_router(prediction.router)
app.include_router(integrated_assistant.router)

# Serve static files for outputs
outputs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "outputs")
os.makedirs(outputs_path, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=outputs_path), name="outputs")
