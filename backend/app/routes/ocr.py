from fastapi import APIRouter, UploadFile, File, HTTPException
import pytesseract
from PIL import Image
import io
import re
import cv2
import numpy as np
from pdf2image import convert_from_bytes
import regex

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

def extract_values(text: str):
    original_text = text

    # Normalize OCR text
    text = text.lower()
    text = text.replace(",", ".")
    text = re.sub(r"[|]", " ", text)
    text = re.sub(r"\s+", " ", text)

    def find_value(patterns):
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    return None
        return None

    extracted = {
        "fsh": find_value([
            r"\bf\.?\s*s\.?\s*h\.?\b\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"\bfsh\b\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ]),

        "lh": find_value([
            r"\bl\.?\s*h\.?\b\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"\blh\b\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ]),

        "amh": find_value([
            r"\bamh\b\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"anti\s*mullerian\s*hormone\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ]),

        "vitamin_d3": find_value([
            r"25\s*\(?\s*oh\s*\)?\s*vit\s*d(?:\s*\([^)]+\))?\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"25\s*hydroxy\s*vitamin\s*d\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"vit\s*d\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"vitamin\s*d3?\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ]),

        "fasting_glucose": find_value([
            r"fasting\s*glucose\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"glucose\s*fasting\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"\bfbg\b\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ]),

        "insulin": find_value([
            r"\binsulin\b\s*[:\-]?\s*(\d+(?:\.\d+)?)",
            r"fasting\s*insulin\s*[:\-]?\s*(\d+(?:\.\d+)?)"
        ])
    }

    fsh = extracted.get("fsh")
    lh = extracted.get("lh")

    extracted["fsh_lh_ratio"] = round(fsh / lh, 2) if fsh and lh else None
    extracted["lh_fsh_ratio"] = round(lh / fsh, 2) if fsh and lh else None

    return extracted

@router.post("/lab-test")
async def ocr_lab_test(file: UploadFile = File(...)):
    content_type = file.content_type
    
    if content_type not in ["image/png", "image/jpeg", "image/jpg", "application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, and PDF are supported.")
    
    try:
        images = []
        file_bytes = await file.read()
        
        if content_type == "application/pdf":
            images = convert_from_bytes(file_bytes, first_page=1, last_page=1)
        else:
            images = [Image.open(io.BytesIO(file_bytes))]
            
        if not images:
            raise HTTPException(status_code=400, detail="Could not process file content.")
            
        # Preprocessing & Multi-pass OCR
        img = images[0].convert('L') # Start with grayscale
        open_cv_image = np.array(img)
        
        variants = []
        # 1. Original grayscale
        variants.append(open_cv_image)
        # 2. Resized 3x
        h, w = open_cv_image.shape
        variants.append(cv2.resize(open_cv_image, (w*3, h*3), interpolation=cv2.INTER_CUBIC))
        # 3. Otsu threshold
        _, otsu = cv2.threshold(open_cv_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        variants.append(otsu)
        # 4. Adaptive threshold
        adaptive = cv2.adaptiveThreshold(open_cv_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        variants.append(adaptive)
        # 5. Sharpened
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        variants.append(cv2.filter2D(open_cv_image, -1, kernel))
        # 6. Contrast-enhanced (CLAHE)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        variants.append(clahe.apply(open_cv_image))
        
        all_texts = []
        configs = ["--oem 3 --psm 6", "--oem 3 --psm 11", "--oem 3 --psm 12"]
        
        for variant in variants:
            for config in configs:
                text = pytesseract.image_to_string(variant, config=config)
                if text.strip():
                    all_texts.append(text)
        
        # Combine and remove duplicate lines
        combined_text = "\n".join(all_texts)
        unique_lines = list(dict.fromkeys(combined_text.splitlines()))
        final_text = "\n".join(unique_lines)
        
        # Debugging
        print("--- COMBINED RAW TEXT ---")
        print(final_text)
        print("-------------------------")
        
        extracted = extract_values(final_text)
        
        print("--- EXTRACTED VALUES ---")
        print(extracted)
        print("------------------------")
        
        return {
            "raw_text": final_text,
            "extracted": extracted
        }
        
    except Exception as e:
        print(f"OCR Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
