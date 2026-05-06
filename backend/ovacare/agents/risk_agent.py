# agents/risk_agent.py â€” Real LightGBM + SHAP risk assessment

import numpy as np
import pandas as pd
import joblib
import shap
from pathlib import Path
from ovacare.config.config import settings


class RiskAgent:
    """
    PCOS Risk Assessment Agent
    Uses LightGBM model + SHAP explainability for preclinical risk scoring.
    Operates on 10 patient-reportable symptom features.
    """

    def __init__(self):
        self._load_models()

    def _load_models(self):
        """Load all pre-trained models and preprocessing artifacts."""
        models_dir = settings.MODELS_DIR

        # LightGBM classifier
        self.model = joblib.load(models_dir / "lgbm_patient_alert.pkl")

        # Preprocessing
        self.imputer = joblib.load(models_dir / "imputer_patient.pkl")
        self.scaler = joblib.load(models_dir / "scaler_patient.pkl")

        # Feature names
        self.feature_names = joblib.load(models_dir / "patient_features.pkl")
        if isinstance(self.feature_names, pd.Index):
            self.feature_names = self.feature_names.tolist()

        # SHAP explainer (lazy-loaded on first use)
        self._explainer = None

        print(f"RiskAgent loaded -- {len(self.feature_names)} features")


    @property
    def explainer(self):
        """Lazy-load SHAP explainer (expensive to init)."""
        if self._explainer is None:
            self._explainer = shap.TreeExplainer(self.model)
        return self._explainer

    def _preprocess(self, symptom_data: dict) -> pd.DataFrame:
        """
        Preprocess a single patient's symptom data.
        Maps the 10 symptom features, imputes, and scales.
        """
        # Build dataframe with expected features, filling missing with NaN
        row = {}
        for feat in self.feature_names:
            row[feat] = symptom_data.get(feat, np.nan)

        df = pd.DataFrame([row])

        # Impute missing values
        X_imputed = pd.DataFrame(
            self.imputer.transform(df),
            columns=self.feature_names,
        )

        # Scale
        X_scaled = pd.DataFrame(
            self.scaler.transform(X_imputed),
            columns=self.feature_names,
        )

        return X_scaled

    def assess_risk(self, symptom_data: dict) -> dict:
        """
        Calculate PCOS risk probability from symptom data.
        Returns only native Python types (no numpy.bool_).
        """
        X = self._preprocess(symptom_data)

        # Force native Python float
        proba = float(self.model.predict_proba(X)[0, 1])

        # Risk level
        if proba >= getattr(settings, 'RISK_CRITICAL_THRESHOLD', 0.85):
            risk_level = "HIGH"
        elif proba >= getattr(settings, 'RISK_HIGH_THRESHOLD', 0.7):
            risk_level = "HIGH"
        elif proba >= getattr(settings, 'RISK_LOW_THRESHOLD', 0.4):
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # SHAP values
        shap_values = self.explainer.shap_values(X)
        if isinstance(shap_values, list):
            shap_vals = shap_values[1][0]
        else:
            shap_vals = shap_values[0]

        top_indices = np.argsort(np.abs(shap_vals))[::-1][:3]
        top_features = []
        for i in top_indices:
            top_features.append({
                "feature": self.feature_names[i],
                "shap_value": float(shap_vals[i]),
                "impact": "increases risk" if shap_vals[i] > 0 else "decreases risk",
            })

        return {
            "risk_probability": round(proba, 4),
            "risk_level": risk_level,
            "top_shap_features": top_features,
            "top_feature_names": [f["feature"] for f in top_features],
            "alert": bool(proba >= getattr(settings, 'RISK_HIGH_THRESHOLD', 0.7)),  # ← Native bool
            "disclaimer": "This is a risk indicator, not a medical diagnosis. Please consult your doctor.",
        }
        
    def explain_risk(self, symptom_data: dict) -> dict:
        """
        Generate detailed SHAP explanation for all features.
        """
        X = self._preprocess(symptom_data)
        shap_values = self.explainer.shap_values(X)

        if isinstance(shap_values, list):
            shap_vals = shap_values[1][0]
        else:
            shap_vals = shap_values[0]

        explanation = {}
        for i, feat in enumerate(self.feature_names):
            explanation[feat] = {
                "shap_value": float(shap_vals[i]),
                "raw_value": float(X.iloc[0][feat]),
                "impact": "increases risk" if shap_vals[i] > 0 else "decreases risk",
            }

        return {
            "feature_explanations": explanation,
            "base_value": float(self.explainer.expected_value[1] if isinstance(self.explainer.expected_value, list) else self.explainer.expected_value),
        }


# Singleton instance
_risk_agent_instance = None


def get_risk_agent() -> RiskAgent:
    """Get or create the singleton RiskAgent instance."""
    global _risk_agent_instance
    if _risk_agent_instance is None:
        _risk_agent_instance = RiskAgent()
    return _risk_agent_instance
