import cv2
import numpy as np
import json
import os
from pathlib import Path

def generate_follicle_pseudo_mask(image: np.ndarray, config: dict):
    # 1. Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    # 2. Crop borders
    margin = config.get("crop_margin", 0)
    h, w = gray.shape
    if margin > 0:
        gray = gray[margin:h-margin, margin:w-margin]
    
    # 3. Resize
    target_size = config.get("image_size", 224)
    gray = cv2.resize(gray, (target_size, target_size))
    original_resized = gray.copy()
    
    # 4. Median Blur
    median_k = config.get("preprocessing", {}).get("median_blur_kernel", 5)
    gray = cv2.medianBlur(gray, median_k)
    
    # 5. CLAHE
    clahe_cfg = config.get("preprocessing", {}).get("clahe_clip_limit", 2.0)
    tile_grid = tuple(config.get("preprocessing", {}).get("clahe_grid_size", [8, 8]))
    clahe = cv2.createCLAHE(clipLimit=clahe_cfg, tileGridSize=tile_grid)
    gray = clahe.apply(gray)
    
    # 6. Threshold dark regions
    dark_thresh = config.get("thresholding", {}).get("dark_threshold", 50)
    _, thresh = cv2.threshold(gray, dark_thresh, 255, cv2.THRESH_BINARY_INV)
    
    # 7. Morphology
    open_k = config.get("morphology", {}).get("open_kernel", 3)
    close_k = config.get("morphology", {}).get("close_kernel", 3)
    kernel_open = np.ones((open_k, open_k), np.uint8)
    kernel_close = np.ones((close_k, close_k), np.uint8)
    
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel_open)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel_close)
    
    # 8. Remove border-touching components
    h_t, w_t = thresh.shape
    mask_border = np.zeros_like(thresh)
    cv2.rectangle(mask_border, (0,0), (w_t-1, h_t-1), 255, 1)
    
    # Simple way: find components and check if they overlap with border
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh)
    for i in range(1, num_labels):
        x, y, w_comp, h_comp, _ = stats[i]
        if x == 0 or y == 0 or (x + w_comp) == w_t or (y + h_comp) == h_t:
            thresh[labels == i] = 0

    # 9. Extract contours & 10. Filter
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    final_mask = np.zeros_like(thresh)
    follicles = []
    filter_cfg = config.get("filtering", {})
    
    center_y, center_x = h_t // 2, w_t // 2
    max_dist = np.sqrt(center_x**2 + center_y**2)

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if filter_cfg.get("min_area", 0) <= area <= filter_cfg.get("max_area", 99999):
            perimeter = cv2.arcLength(cnt, True)
            circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
            
            if circularity >= filter_cfg.get("min_circularity", 0):
                # Center distance ratio check
                M = cv2.moments(cnt)
                if M["m00"] != 0:
                    cX = int(M["m10"] / M["m00"])
                    cY = int(M["m01"] / M["m00"])
                    dist = np.sqrt((cX - center_x)**2 + (cY - center_y)**2)
                    dist_ratio = dist / max_dist
                    
                    if dist_ratio <= filter_cfg.get("center_distance_ratio", 1.0):
                        cv2.drawContours(final_mask, [cnt], -1, 255, -1)
                        follicles.append({
                            "area": area,
                            "circularity": circularity
                        })

    # 11. Compute features
    count = len(follicles)
    avg_area = np.mean([f['area'] for f in follicles]) if count > 0 else 0
    total_area = np.sum([f['area'] for f in follicles]) if count > 0 else 0
    avg_circ = np.mean([f['circularity'] for f in follicles]) if count > 0 else 0

    # 12. Create overlay
    overlay = cv2.merge([original_resized, original_resized, original_resized])
    overlay[final_mask == 255] = [0, 255, 0] # Green follicles
    
    features = {
        "follicle_count": count,
        "avg_area": float(avg_area),
        "total_area": float(total_area),
        "avg_circularity": float(avg_circ)
    }
    
    return final_mask, overlay, features

class SegmentationService:
    def __init__(self, config_path="models/wajd/segmentation/segmentation_config.json"):
        self.base_path = Path(__file__).parent.parent
        full_config_path = self.base_path / config_path
        if not full_config_path.exists():
            raise FileNotFoundError(f"Config not found: {full_config_path}")
            
        with open(full_config_path, 'r') as f:
            self.config = json.load(f)
            
        # Ensure output directories exist
        self.masks_dir = self.base_path / "outputs/masks"
        self.overlays_dir = self.base_path / "outputs/overlays"
        os.makedirs(self.masks_dir, exist_ok=True)
        os.makedirs(self.overlays_dir, exist_ok=True)

    def process_image(self, image_bytes, filename):
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image format")
            
        mask, overlay, features = generate_follicle_pseudo_mask(img, self.config)
        
        mask_filename = f"mask_{filename}.png"
        overlay_filename = f"overlay_{filename}.png"
        
        cv2.imwrite(str(self.masks_dir / mask_filename), mask)
        cv2.imwrite(str(self.overlays_dir / overlay_filename), overlay)
        
        return {
            **features,
            "mask_url": f"/outputs/masks/{mask_filename}",
            "overlay_url": f"/outputs/overlays/{overlay_filename}"
        }
