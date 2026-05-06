# config/config.py â€” Unified configuration (settings + prompts + model paths)

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=_env_path, override=True)


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# SETTINGS
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class Settings:
    # â”€â”€ API Keys â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # â”€â”€ LangSmith â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    LANGCHAIN_TRACING_V2: str = os.getenv("LANGCHAIN_TRACING_V2", "false")
    LANGSMITH_API_KEY: str = os.getenv("LANGSMITH_API_KEY", "")
    LANGSMITH_PROJECT: str = os.getenv("LANGSMITH_PROJECT", "ovacare-pcos-test")

    # â”€â”€ LLM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    TEMPERATURE: float = 0.0  # Zero for consistent medical responses

    # â”€â”€ Model Paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    MODELS_DIR: Path = Path(os.getenv("MODELS_DIR", str(Path(__file__).resolve().parent.parent.parent.parent.parent / "ovacare-ai-assistant" / "models")))

    # Risk models
    LGBM_MODEL_PATH: Path = MODELS_DIR / "lgbm_patient_alert.pkl"
    IMPUTER_PATH: Path = MODELS_DIR / "imputer_patient.pkl"
    SCALER_PATH: Path = MODELS_DIR / "scaler_patient.pkl"
    FEATURES_PATH: Path = MODELS_DIR / "patient_features.pkl"

    # Acne model
    ACNE_MODEL_PATH: Path = MODELS_DIR / "acne_mobilenet_v2_phase2.pth"

    # Progression / LSTM model
    LSTM_MODEL_PATH: Path = MODELS_DIR / "optimized_sequence_model.h5"
    LSTM_FEATURES_PATH: Path = MODELS_DIR / "lstm_features.pkl"
    LSTM_CONFIG_PATH: Path = MODELS_DIR / "sequence_model_config.pkl"

    # â”€â”€ Database â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///ovacare.db")

    # â”€â”€ Risk Thresholds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    RISK_LOW_THRESHOLD: float = 0.35
    RISK_HIGH_THRESHOLD: float = 0.65
    RISK_CRITICAL_THRESHOLD: float = 0.90

    # â”€â”€ App info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    PROJECT_NAME: str = "OvaCare PCOS AI Assistant"
    VERSION: str = "1.0.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # â”€â”€ Symptom features (patient-reportable) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    SYMPTOM_FEATURES: list = [
        "cycle_r_i",
        "hair_growth_y_n",
        "skin_darkening_y_n",
        "pimples_y_n",
        "hair_loss_y_n",
        "weight_gain_y_n",
        "fast_food_y_n",
        "reg.exercise_y_n",
        "bmi",
        "age_yrs",
    ]


settings = Settings()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# PROMPTS
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

SUPERVISOR_PROMPT = """You are OvaCare, an empathetic and medically careful AI health companion for PCOS management.

NEVER diagnose. Always assess risk and guide patients to see doctors for clinical decisions.

Available agents:
- risk: Preclinical PCOS risk assessment (symptoms â†’ LightGBM model â†’ risk score)
- acne: Acne severity detection from facial images (image â†’ EfficientNet â†’ severity 0-3)
- progression: PCOS trend tracking over time (30-day history â†’ LSTM â†’ trend direction)

Routing rules:
- 'risk', 'PCOS', 'score', 'level', 'symptoms', 'chance', 'do I have' â†’ risk agent
- 'acne', 'skin', 'face', 'pimple', 'image', 'photo' â†’ acne agent
- 'trend', 'progression', 'getting worse', 'improving', 'over time', 'history' â†’ progression agent

SAFETY RULES:
- If risk > 0.90: ALWAYS say "Please see a doctor immediately"
- Never claim diagnosis
- Add disclaimer: "This is a risk indicator, not a medical diagnosis"
"""

RISK_AGENT_PROMPT = """You are the PCOS Risk Assessment Agent.
Your job: Assess preclinical PCOS risk from symptom logs using a validated LightGBM model.

Use your tools to:
1. Get the preclinical risk score (probability + risk level)
2. Get SHAP explanations (top contributing factors)
3. Get user profile context

Always provide in your response:
- Risk level (LOW / MEDIUM / HIGH) with probability percentage
- Top 3 contributing symptom factors from SHAP analysis
- Clear explanation in patient-friendly language
- Disclaimer: "This is a risk indicator, not a diagnosis"

If HIGH risk (>=0.65): Recommend seeing a gynecologist.
If CRITICAL (>=0.90): Urgently recommend immediate medical consultation.
"""

ACNE_AGENT_PROMPT = """You are the Acne Severity Analysis Agent.
Your job: Analyze acne severity from facial images using computer vision.

Use your tools to:
1. Analyze the uploaded image for acne severity (0-3 scale)
2. Get historical acne trend if available

Severity scale:
- 0: No significant acne detected
- 1: Mild acne (few blemishes)
- 2: Moderate acne (noticeable inflammation)
- 3: Severe acne (widespread, deep lesions)

Always provide:
- Current severity level with confidence score
- Trend over time (if history available)
- Correlation with PCOS hormonal changes
- Skincare recommendations appropriate to severity
- Encouragement to log daily for better tracking
"""

PROGRESSION_AGENT_PROMPT = """You are the PCOS Progression Tracking Agent.
Your job: Track how PCOS symptoms are changing over time using LSTM deep learning.

Use your tools to:
1. Analyze the last 30 days of symptom data for trend direction
2. Detect any specific patterns (e.g., cycle-related spikes)

Always provide:
- Trend direction: IMPROVING, STABLE, or WORSENING
- Confidence score for the trend prediction
- Any detected patterns (e.g., "luteal phase symptom spike")
- Risk trajectory (decreasing / stable / increasing)
- Actionable advice based on the trend

If WORSENING trend: Recommend consulting a healthcare provider.
"""

