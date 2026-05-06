import joblib
import json
import numpy as np
from pathlib import Path

class TabularService:
    def __init__(self, model_path="models/wajd/tabular/best_rf_model.pkl", columns_path="models/wajd/tabular/feature_columns.json"):
        self.base_path = Path(__file__).parent.parent
        full_model_path = self.base_path / model_path
        full_columns_path = self.base_path / columns_path
        
        if not full_model_path.exists():
            raise FileNotFoundError(f"Model file not found at: {full_model_path}")
        if not full_columns_path.exists():
            raise FileNotFoundError(f"Feature columns file not found at: {full_columns_path}")

        try:
            self.model = joblib.load(full_model_path)
            with open(full_columns_path, 'r') as f:
                self.feature_columns = json.load(f)
        except Exception as e:
            raise RuntimeError(f"Failed to load tabular model or features: {e}")

    def predict(self, patient_data, segmentation_data):
        # 1. Merge features
        merged_data = {**patient_data, **segmentation_data}
        
        # 2. Strict feature check and ordering
        features = []
        missing_features = []
        
        for col in self.feature_columns:
            if col not in merged_data:
                missing_features.append(col)
            else:
                try:
                    val = merged_data[col]
                    # Ensure numeric
                    features.append(float(val))
                except (ValueError, TypeError):
                    raise ValueError(f"Feature '{col}' must be a numeric value. Received: {merged_data[col]}")
        
        if missing_features:
            raise ValueError(f"Missing required features: {', '.join(missing_features)}")

        # 3. Predict
        try:
            features_arr = np.array([features])
            
            # Get probability of class 1 (PCOS)
            if hasattr(self.model, "predict_proba"):
                probs = self.model.predict_proba(features_arr)
                p_tabular = probs[0][1]
            else:
                # Fallback to binary prediction if proba not available
                p_tabular = float(self.model.predict(features_arr)[0])
            
            return {
                "p_tabular": float(p_tabular),
                "tabular_prediction": "PCOS risk" if p_tabular >= 0.5 else "Low risk"
            }
        except Exception as e:
            raise RuntimeError(f"Tabular inference failed: {e}")
