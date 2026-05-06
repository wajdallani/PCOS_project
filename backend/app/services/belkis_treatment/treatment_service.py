import os
from typing import Dict, Any

import joblib
import numpy as np
import pandas as pd


class TreatmentService:
    def __init__(self):
        # backend/app/services/belkis_treatment/treatment_service.py
        # Move up 4 levels to get to backend/
        from pathlib import Path
        self.base_path = Path(__file__).resolve().parent.parent.parent.parent
        self.model_path = str(self.base_path / "models" / "Belkis_treatment" / "best_xgboost_model.pkl")

        self.feature_order = [
            "FSH/LH",
            "FSHmIU/mL",
            "LHmIU/mL",
            "AMHng/mL",
            "BMI",
            "RBSmg/dl",
            "Follicle_No._L",
            "Follicle_No._R",
        ]

        self.model = None
        self._load_model()

    def _load_model(self):
        print(f"Treatment model path: {self.model_path}")

        if not os.path.exists(self.model_path):
            print(f"Treatment model file not found at: {self.model_path}")
            return

        try:
            self.model = joblib.load(self.model_path)
            print("Treatment model loaded successfully.")
        except Exception as e:
            print(f"Error loading treatment model: {e}")
            self.model = None

    def _validate_and_prepare(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        processed_data = {}

        missing_fields = []

        for feature in self.feature_order:
            value = input_data.get(feature)

            if value is None or value == "":
                missing_fields.append(feature)
                continue

            try:
                processed_data[feature] = float(value)
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric value for field: {feature}")

        if missing_fields:
            raise ValueError(f"Missing required fields: {missing_fields}")

        return pd.DataFrame([processed_data], columns=self.feature_order)

    def predict_treatment_response(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.model is None:
            return {
                "error": f"Model file not available. Expected path: {self.model_path}"
            }

        try:
            df = self._validate_and_prepare(input_data)

            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(df)[0]
                prediction_idx = int(np.argmax(probs))
                confidence = float(probs[prediction_idx])
                raw_prediction = probs.tolist()
            else:
                prediction_idx = int(self.model.predict(df)[0])
                confidence = 1.0
                raw_prediction = prediction_idx

            recommendation = "metformin" if prediction_idx == 0 else "myo-inositol"

            return {
                "effectiveness_score": round(confidence, 4),
                "recommendation": recommendation,
                "recommendation_label": recommendation.upper().replace("-", "_"),
                "raw_prediction": raw_prediction,
            }

        except Exception as e:
            return {
                "error": f"Error during prediction: {str(e)}"
            }

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.predict_treatment_response(input_data)


treatment_service = TreatmentService()