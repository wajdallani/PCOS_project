# agents/progression_agent.py â€” PCOS trend detection using LSTM

import numpy as np
import joblib
from pathlib import Path

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

from ovacare.config.config import settings


class ProgressionAgent:
    """
    PCOS Progression Tracking Agent.
    Uses an optimized LSTM model to detect trend direction
    from 30-day symptom sequences.
    """

    def __init__(self):
        self.model = None
        self.lstm_features = None
        self.model_config = None
        self._load_model()

    def _load_model(self):
        """Load the LSTM model and its configuration."""
        if not TF_AVAILABLE:
            print("TensorFlow not available — ProgressionAgent will use rule-based fallback")
            return

        models_dir = settings.MODELS_DIR

        try:
            # Load LSTM model
            model_path = models_dir / "optimized_sequence_model.h5"
            if model_path.exists():
                self.model = tf.keras.models.load_model(str(model_path), compile=False)
                print(f"ProgressionAgent LSTM loaded -- input shape: {self.model.input_shape}")
            else:
                print(f"LSTM model not found at {model_path}")

            # Load feature names
            features_path = models_dir / "lstm_features.pkl"
            if features_path.exists():
                self.lstm_features = joblib.load(features_path)
                if isinstance(self.lstm_features, list):
                    print(f" LSTM features: {len(self.lstm_features)} features")
                elif isinstance(self.lstm_features, dict):
                    self.lstm_features = list(self.lstm_features.keys())
                    print(f" LSTM features (from dict): {len(self.lstm_features)} features")

            # Load model config
            config_path = models_dir / "sequence_model_config.pkl"
            if config_path.exists():
                self.model_config = joblib.load(config_path)
                print(f" LSTM config loaded: {self.model_config}")

        except Exception as e:
            print(f" Error loading LSTM model: {e}")
            self.model = None

    def analyze_progression(self, historical_data: list) -> dict:
        """
        Analyze PCOS progression from historical symptom data.

        Args:
            historical_data: list of dicts, each with symptom values for one day.
                             Should contain 30 days of data ideally.

        Returns:
            dict with trend_direction, confidence, pattern_detected, risk_trajectory
        """
        if not historical_data:
            return {
                "trend_direction": "INSUFFICIENT_DATA",
                "trend_confidence": 0.0,
                "pattern_detected": None,
                "risk_trajectory": "unknown",
                "message": "No historical data provided. Please log symptoms for at least 7 days.",
            }

        if len(historical_data) < 7:
            # Not enough data for LSTM â€” use rule-based
            return self._rule_based_trend(historical_data)

        if self.model is not None and TF_AVAILABLE:
            return self._lstm_predict(historical_data)
        else:
            return self._rule_based_trend(historical_data)

    def _lstm_predict(self, historical_data: list) -> dict:
        """Run the LSTM model on the historical sequence."""
        try:
            # Determine expected sequence length from model input
            expected_length = self.model.input_shape[1]  # (batch, timesteps, features)
            expected_features = self.model.input_shape[2]

            # Build feature matrix
            if self.lstm_features:
                feature_names = self.lstm_features
            else:
                # Fallback: use all available keys from first entry
                feature_names = [k for k in historical_data[0].keys() if k != "date"]

            # Pad or truncate to expected length
            sequence = []
            for entry in historical_data[-expected_length:]:
                row = []
                for feat in feature_names[:expected_features]:
                    row.append(float(entry.get(feat, 0.0)))
                # Pad features if needed
                while len(row) < expected_features:
                    row.append(0.0)
                sequence.append(row)

            # Pad timesteps if needed
            while len(sequence) < expected_length:
                sequence.insert(0, [0.0] * expected_features)

            # Convert to numpy and reshape: (1, timesteps, features)
            X = np.array([sequence], dtype=np.float32)

            # Predict
            prediction = self.model.predict(X, verbose=0)

            # Interpret output
            if prediction.shape[-1] == 1:
                # Binary: worsening probability
                worsen_prob = float(prediction[0, 0])
                if worsen_prob >= 0.6:
                    trend = "WORSENING"
                    confidence = worsen_prob
                elif worsen_prob <= 0.4:
                    trend = "IMPROVING"
                    confidence = 1.0 - worsen_prob
                else:
                    trend = "STABLE"
                    confidence = 1.0 - abs(worsen_prob - 0.5) * 2
            elif prediction.shape[-1] == 3:
                # 3-class: improving, stable, worsening
                classes = ["IMPROVING", "STABLE", "WORSENING"]
                pred_class = int(np.argmax(prediction[0]))
                trend = classes[pred_class]
                confidence = float(prediction[0, pred_class])
            else:
                # Fallback
                return self._rule_based_trend(historical_data)

            # Pattern detection
            pattern = self._detect_pattern(historical_data)

            # Risk trajectory
            if trend == "WORSENING":
                trajectory = "increasing"
            elif trend == "IMPROVING":
                trajectory = "decreasing"
            else:
                trajectory = "stable"

            return {
                "trend_direction": trend,
                "trend_confidence": round(confidence, 4),
                "pattern_detected": pattern,
                "risk_trajectory": trajectory,
                "data_points_used": len(historical_data),
                "model_used": "LSTM",
            }

        except Exception as e:
            print(f" LSTM prediction error: {e}")
            return self._rule_based_trend(historical_data)

    def _rule_based_trend(self, historical_data: list) -> dict:
        """
        Simple rule-based trend detection when LSTM is not available.
        Compares average severity of recent vs older data.
        """
        # Compute a composite severity score per day
        scores = []
        for entry in historical_data:
            score = 0.0
            count = 0
            for key, value in entry.items():
                if key == "date":
                    continue
                try:
                    score += float(value)
                    count += 1
                except (ValueError, TypeError):
                    pass
            if count > 0:
                scores.append(score / count)

        if len(scores) < 2:
            return {
                "trend_direction": "INSUFFICIENT_DATA",
                "trend_confidence": 0.0,
                "pattern_detected": None,
                "risk_trajectory": "unknown",
                "model_used": "rule-based",
            }

        mid = len(scores) // 2
        avg_old = np.mean(scores[:mid])
        avg_new = np.mean(scores[mid:])

        diff = avg_new - avg_old
        magnitude = abs(diff)

        if diff > 0.1:
            trend = "WORSENING"
        elif diff < -0.1:
            trend = "IMPROVING"
        else:
            trend = "STABLE"

        confidence = min(0.95, 0.5 + magnitude * 2)

        pattern = self._detect_pattern(historical_data)

        if trend == "WORSENING":
            trajectory = "increasing"
        elif trend == "IMPROVING":
            trajectory = "decreasing"
        else:
            trajectory = "stable"

        return {
            "trend_direction": trend,
            "trend_confidence": round(confidence, 4),
            "pattern_detected": pattern,
            "risk_trajectory": trajectory,
            "data_points_used": len(historical_data),
            "model_used": "rule-based",
        }

    def _detect_pattern(self, historical_data: list) -> str | None:
        """
        Detect common patterns in symptom data.
        Returns pattern name or None.
        """
        if len(historical_data) < 14:
            return None

        # Check for cyclic pattern (roughly 28-day cycle)
        scores = []
        for entry in historical_data:
            score = sum(
                float(v) for k, v in entry.items()
                if k != "date" and isinstance(v, (int, float))
            )
            scores.append(score)

        if len(scores) >= 28:
            # Check if there's a spike around day 14 (ovulation) or day 21-28 (luteal)
            mid_cycle = scores[12:16]  # around day 14
            luteal = scores[20:28] if len(scores) >= 28 else scores[-7:]
            early = scores[:7]

            avg_early = np.mean(early) if early else 0
            avg_mid = np.mean(mid_cycle) if mid_cycle else 0
            avg_luteal = np.mean(luteal) if luteal else 0

            if avg_luteal > avg_early * 1.3 and avg_luteal > avg_mid:
                return "luteal_phase_spike"
            elif avg_mid > avg_early * 1.3:
                return "ovulation_spike"

        # Check for general upward trend
        if len(scores) >= 7:
            first_quarter = np.mean(scores[:len(scores)//4])
            last_quarter = np.mean(scores[-len(scores)//4:])
            if last_quarter > first_quarter * 1.5:
                return "progressive_worsening"
            elif first_quarter > last_quarter * 1.5:
                return "progressive_improvement"

        return None


# Singleton instance
_progression_agent_instance = None


def get_progression_agent() -> ProgressionAgent:
    """Get or create the singleton ProgressionAgent instance."""
    global _progression_agent_instance
    if _progression_agent_instance is None:
        _progression_agent_instance = ProgressionAgent()
    return _progression_agent_instance

