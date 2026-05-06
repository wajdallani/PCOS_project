import os
import io
import requests
from typing import Dict, Any

import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "Asma_Acne", "acne_mobilenet_v2_phase2.pth")

LABELS = {
    0: "CLEAR_SKIN",
    1: "MILD_ACNE",
    2: "MODERATE_ACNE",
    3: "SEVERE_ACNE",
}

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def build_model() -> torch.nn.Module:
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, 4)
    return model


def load_model() -> torch.nn.Module:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Acne model not found at: {MODEL_PATH}")

    model = build_model()
    state_dict = torch.load(MODEL_PATH, map_location=DEVICE)

    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()

    return model


model = load_model()


preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


def load_image_from_url(image_url: str) -> Image.Image:
    try:
        response = requests.get(image_url, timeout=15)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not load image from URL: {str(e)}")


def predict_acne_from_url(face_image_url: str) -> Dict[str, Any]:
    image = load_image_from_url(face_image_url)

    x = preprocess(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = model(x)
        probs = torch.softmax(outputs, dim=1)
        acne_level = int(torch.argmax(probs, dim=1).item())
        confidence = float(probs[0][acne_level].item())

    acne_label = LABELS.get(acne_level, "UNKNOWN")

    return {
        "acne_level": acne_level,
        "acne_label": acne_label,
        "confidence": round(confidence, 4),
    }