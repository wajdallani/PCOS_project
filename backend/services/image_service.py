import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import requests
from pathlib import Path
def create_resnet50_medical(num_classes=2, dropout=0.4):
    model = models.resnet50(weights=None)
    in_features = model.fc.in_features

    model.fc = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.BatchNorm1d(256),
        nn.ReLU(),
        nn.Dropout(dropout),
        nn.Linear(256, num_classes)
    )

    return model
class ImageService:
    def __init__(self, model_path="models/wajd/image/resnet50_layer234_best (1).pt", config_path="models/wajd/image/img_preprocess.json"):
        self.base_path = Path(__file__).parent.parent
        full_model_path = self.base_path / model_path
        full_config_path = self.base_path / config_path
        
        # 1. File existence checks
        if not full_model_path.exists():
            raise FileNotFoundError(f"Model file not found at: {full_model_path}")
        if not full_config_path.exists():
            raise FileNotFoundError(f"Config file not found at: {full_config_path}")

        try:
            with open(full_config_path, 'r') as f:
                self.config = json.load(f)
        except Exception as e:
            raise ValueError(f"Failed to load config: {e}")
            
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        try:
            # 2. Architecture: exact match for ResNet50 medical
            self.model = create_resnet50_medical(num_classes=2, dropout=0.4)

            # 3. Load state dict
            checkpoint = torch.load(full_model_path, map_location=self.device)
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
            else:
                state_dict = checkpoint

            self.model.load_state_dict(state_dict)
            self.model.to(self.device)
            self.model.eval()
        except Exception as e:
            raise RuntimeError(f"Failed to initialize model or load weights: {e}")

        try:
            trans_cfg = self.config["inference_transforms"]
            self.transform = transforms.Compose([
                transforms.Resize(tuple(trans_cfg["resize"])),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=trans_cfg["normalization_mean"],
                    std=trans_cfg["normalization_std"]
                )
            ])
        except KeyError as e:
            raise KeyError(f"Missing transform configuration: {e}")

    def predict(self, image_bytes):
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        except Exception:
            raise ValueError("Invalid image file provided.")

        try:
            img_t = self.transform(img).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(img_t)
                probabilities = torch.softmax(outputs, dim=1)
                p_pcos = probabilities[0][1].item() # Probability of class 1 (PCOS)
                
            prediction_label = self.config['class_mapping']["1" if p_pcos >= 0.5 else "0"]
            
            return {
                "p_image": p_pcos,
                "image_prediction": prediction_label
            }
        except Exception as e:
            raise RuntimeError(f"Inference failed: {e}")

    def predict_from_url(self, image_url: str):
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            return self.predict(response.content)
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to download image from URL: {e}")
        except Exception as e:
            raise RuntimeError(f"Error processing image from URL: {e}")
