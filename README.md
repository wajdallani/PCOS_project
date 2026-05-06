# OvaCare – AI-Powered PCOS Detection and Monitoring Platform

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![PyTorch](https://img.shields.io/badge/PyTorch-DeepLearning-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview

OvaCare is a multimodal AI healthcare platform designed for **Polycystic Ovary Syndrome (PCOS)** detection, monitoring, and personalized patient support.

This project was developed as part of engineering and AI research work at **Esprit School of Engineering**.

The platform combines:

- Machine Learning
- Deep Learning
- Explainable AI (XAI)
- Medical Imaging
- Full-Stack Web Development

to assist both doctors and patients through intelligent healthcare tools.

---

# Features

## Doctor AI Modules

### PCOS Risk Prediction
Predict PCOS probability using clinical and hormonal patient data.

### Ultrasound Analysis
Analyze ovarian ultrasound images using a deep learning ResNet50 model.

### Multimodal AI Fusion
Combine clinical prediction and ultrasound prediction using weighted late fusion.

### Explainable AI
Interpret predictions using:
- SHAP (tabular explainability)
- Grad-CAM (medical imaging explainability)

### Treatment Response Prediction
Predict treatment effectiveness and recommend:
- Metformin
- Myo-inositol

### AI Medical Dashboard
Interactive dashboard for:
- patient monitoring
- AI prediction history
- risk analysis
- medical record management

---

## Patient AI Modules

### Risk Alert System
Notify patients about elevated PCOS risk indicators.

### Acne Monitoring
AI-powered acne severity analysis and skin monitoring.

### Hormonal Productivity Synchronization
Provide productivity insights based on hormonal cycle patterns.

### Emotional Detection
Monitor emotional well-being using AI analysis.

### Neuro-Acoustic / Noise Therapy
Relaxation and stress-reduction support through AI-assisted audio therapy.

---

# AI Architecture

## 1. Clinical Prediction Branch

Machine learning models evaluated:
- Random Forest
- LightGBM
- XGBoost
- MLP
- KNN
- SVM

Final selected models:
- Random Forest Tuned + SMOTE

### Techniques Used
- Feature selection
- SMOTE oversampling
- Hyperparameter tuning
- Threshold optimization
- SHAP explainability

### Input Features
- Age
- BMI
- LH
- FSH
- FSH/LH Ratio
- AMH
- Vitamin D3
- Waist-Hip Ratio
- Cycle Length
- Follicle Count
- Endometrium Thickness
- Symptoms and lifestyle indicators

---

## 2. Ultrasound Image Branch

### Model
Transfer Learning using ResNet50.

### Pipeline
- Image preprocessing
- Data augmentation
- Fine-tuning
- Grad-CAM explainability

### Performance
High accuracy on deduplicated ovarian ultrasound dataset.

---

## 3. Multimodal Late Fusion

Clinical and ultrasound predictions are combined using weighted late fusion:

```math
P_{final} = w_1 P_{clinical} + w_2 P_{ultrasound}
```

This improves robustness and diagnostic performance.

---

# Explainable AI (XAI)

OvaCare integrates Explainable AI techniques to improve transparency and trust in medical predictions.

## SHAP
Used for:
- feature importance
- clinical prediction interpretability

## Grad-CAM
Used for:
- ultrasound image explainability
- highlighting important ovarian regions

---

# Tech Stack

## Frontend
- React.js
- TypeScript
- Tailwind CSS

## Backend
- FastAPI
- Python
- REST API

## AI / Data Science
- PyTorch
- Scikit-learn
- LightGBM
- XGBoost
- OpenCV
- Pandas
- NumPy
- SHAP

## Database & Cloud
- Supabase
- PostgreSQL

## Deployment & Monitoring
- Docker
- GitHub
- GitHub Education
- FastAPI Inference API

---

# System Modules

| Module | Description |
|---|---|
| PCOS Risk Prediction | Predict PCOS risk from clinical data |
| Ultrasound Classification | Analyze ovarian ultrasound images |
| Late Fusion Engine | Combine multimodal predictions |
| Acne Monitoring | Monitor skin condition progression |
| Treatment Recommendation | Predict treatment effectiveness |
| Emotional Detection | Analyze emotional state |
| Noise Therapy | Relaxation support |
| Medical Dashboard | Doctor-patient management interface |

---

# Directory Structure

```bash
ovacare-ai-pcos-platform/
│
├── frontend/                 # React frontend
├── backend/                  # FastAPI backend
├── models/
│   ├── pcos_prediction/
│   ├── ultrasound_resnet50/
│   ├── acne_monitoring/
│   ├── treatment_prediction/
│   └── emotional_detection/
│
├── notebooks/
│   ├── tabular_models/
│   ├── image_models/
│   ├── late_fusion/
│   └── experiments/
│
├── docs/
│   ├── architecture/
│   ├── screenshots/
│   └── diagrams/
│
├── requirements.txt
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/ovacare-ai-pcos-platform.git
```

---

# Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```txt
http://localhost:8000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Model Inference Workflow

1. Doctor uploads:
   - patient clinical data
   - ovarian ultrasound images

2. Backend performs:
   - tabular prediction
   - image prediction
   - multimodal late fusion

3. AI outputs:
   - PCOS risk score
   - explainability visualizations
   - treatment recommendations

4. Results are:
   - stored in Supabase
   - displayed in the React dashboard

---

# Screenshots

## Doctor Dashboard
_Add screenshot here_

## PCOS Prediction Interface
_Add screenshot here_

## Ultrasound Explainability
_Add screenshot here_

## Treatment Recommendation
_Add screenshot here_

---

# Future Improvements

- Hugging Face model serving
- Mobile application
- Wearable device integration
- Real-time monitoring
- Federated learning
- Medical OCR integration
- AI chatbot assistant

---

# Academic Context

This project was developed as part of AI and software engineering work at **Esprit School of Engineering**.

The objective is to explore:
- multimodal machine learning
- explainable healthcare AI
- medical imaging
- intelligent patient monitoring systems

---

# Acknowledgments

Special thanks to:

- **Esprit School of Engineering**
- Open-source AI community
- Healthcare AI research contributors

---

# License

This project is licensed under the MIT License.
