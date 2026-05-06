import base64
import io
import numpy as np

try:
    import torch
    import torch.nn as nn
    from torchvision import transforms, models
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

from ovacare.config.config import settings


SEVERITY_LABELS = {
    0: "Clear",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
}

RECOMMENDATIONS = {
    0: [
        "Maintain your current skincare routine",
        "Use SPF 30+ sunscreen daily",
        "Keep tracking for early detection",
    ],
    1: [
        "Use a gentle, non-comedogenic cleanser twice daily",
        "Apply benzoyl peroxide 2.5% on affected areas",
        "Avoid touching your face frequently",
        "Stay hydrated and reduce dairy intake",
    ],
    2: [
        "Consider seeing a dermatologist",
        "Use salicylic acid or adapalene-based treatment",
        "Avoid heavy makeup that clogs pores",
        "Track correlation with your menstrual cycle",
        "Anti-inflammatory diet may help (omega-3, turmeric)",
    ],
    3: [
        "Please consult a dermatologist as soon as possible",
        "Severe acne may be linked to hormonal imbalance in PCOS",
        "Prescription treatments like isotretinoin may be needed",
        "Avoid picking or squeezing — risk of scarring",
        "Discuss hormonal treatment options with your doctor",
    ],
}


class AcneAgent:
    """
    Acne Severity Detection Agent.
    Uses MobileNetV2 fine-tuned for 4-class acne severity classification.
    """

    def __init__(self):
        self.model = None
        self.device = None
        self.transform = None
        self.num_classes = 4
        self._load_model()

    def _build_model(self):
        model = models.mobilenet_v2(weights=None)

        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 256),
            nn.BatchNorm1d(256),
            nn.GELU(),
            nn.Dropout(p=0.2),
            nn.Linear(256, self.num_classes),
        )
        return model

    def _load_model(self):
        if not TORCH_AVAILABLE:
            print("⚠️ PyTorch not available — AcneAgent will use mock predictions")
            return

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ])

        model_path = settings.ACNE_MODEL_PATH

        if not model_path.exists():
            print(f"⚠️ Acne model not found at {model_path} — using mock")
            return

        try:
            self.model = self._build_model()
            state_dict = torch.load(model_path, map_location=self.device, weights_only=False)
            self.model.load_state_dict(state_dict, strict=True)
            self.model.to(self.device)
            self.model.eval()

            print(f"AcneAgent loaded -- {self.num_classes} classes")

        except Exception as e:
            print(f"⚠️ Error loading acne model: {e} — using mock")
            self.model = None

    def _decode_image(self, image_b64: str):
        if not PIL_AVAILABLE:
            raise RuntimeError("Pillow is required for image processing")

        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return image

    def analyze_image(self, image_b64: str) -> dict:
        if self.model is None or not TORCH_AVAILABLE:
            return self._mock_analyze()

        try:
            image = self._decode_image(image_b64)
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)

            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.softmax(outputs, dim=1)[0]

            severity = int(torch.argmax(probabilities).item())
            confidence = float(probabilities[severity].item())

            return {
                "severity": severity,
                "severity_label": SEVERITY_LABELS.get(severity, "Unknown"),
                "confidence": round(confidence, 4),
                "all_probabilities": {
                    SEVERITY_LABELS[i]: round(float(probabilities[i].item()), 4)
                    for i in range(self.num_classes)
                },
                "recommendations": RECOMMENDATIONS.get(severity, []),
                "disclaimer": "This is an AI assessment. Please consult a dermatologist for clinical evaluation.",
            }

        except Exception as e:
            return {
                "severity": -1,
                "severity_label": "Error",
                "confidence": 0.0,
                "error": str(e),
                "recommendations": ["Please try uploading a clearer image"],
            }

    def get_acne_trend(self, history: list) -> dict:
        if not history or len(history) < 2:
            return {
                "trend": "INSUFFICIENT_DATA",
                "message": "Need at least 2 data points to calculate trend",
            }

        severities = [h.get("severity", 0) for h in history]
        recent = severities[-7:]
        older = severities[:-7] if len(severities) > 7 else severities[:len(severities)//2]

        avg_recent = np.mean(recent) if recent else 0
        avg_older = np.mean(older) if older else 0
        diff = avg_recent - avg_older

        if diff < -0.3:
            trend = "IMPROVING"
        elif diff > 0.3:
            trend = "WORSENING"
        else:
            trend = "STABLE"

        return {
            "trend": trend,
            "avg_recent_severity": round(float(avg_recent), 2),
            "avg_older_severity": round(float(avg_older), 2),
            "total_records": len(history),
        }

    def _mock_analyze(self) -> dict:
        severity = np.random.randint(0, 4)
        return {
            "severity": int(severity),
            "severity_label": SEVERITY_LABELS[int(severity)],
            "confidence": round(float(np.random.uniform(0.6, 0.95)), 4),
            "all_probabilities": None,
            "recommendations": RECOMMENDATIONS[int(severity)],
            "disclaimer": "⚠️ Mock prediction — real model not loaded.",
            "_mock": True,
        }


_acne_agent_instance = None


def get_acne_agent() -> AcneAgent:
    global _acne_agent_instance
    if _acne_agent_instance is None:
        _acne_agent_instance = AcneAgent()
    return _acne_agent_instance