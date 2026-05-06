from langchain_core.tools import tool
from typing import Dict, Any

@tool
def simulate_meal_impact(food_description: str) -> Dict[str, Any]:
    """Simulate glucose response from a photo/description of meal."""
    return {
        "predicted_spike": "Moderate",
        "glucose_curve": "Rising then stable after 45 min",
        "hacks": [
            "Eat fiber first (vegetables)",
            "Take a 10-minute walk after meal",
            "Consider apple cider vinegar before eating"
        ],
        "message": f"Meal '{food_description}' is likely to cause a moderate glucose spike."
    }

@tool
def find_peer_match(symptoms: list, goals: str = None) -> Dict[str, Any]:
    """Match user with similar PCOS peers."""
    return {
        "matched_peers": 3,
        "suggestion": "You have been matched with women who also experience fatigue and irregular cycles.",
        "community_tip": "Many users report improvement with consistent evening walks."
    }
