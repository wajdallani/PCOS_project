# tools/acne_tools.py â€” LangChain tools for acne severity analysis

from langchain_core.tools import tool
from typing import Optional


@tool
def analyze_acne_image(user_id: int, image_b64: str) -> dict:
    """
    Analyze a facial image for acne severity using EfficientNet-B0.
    Takes a user_id and base64-encoded JPEG/PNG image.
    Returns severity (0-3), confidence, severity_label, and skincare recommendations.
    
    Severity scale:
    0 = No significant acne
    1 = Mild acne
    2 = Moderate acne
    3 = Severe acne
    """
    from ovacare.agents.acne_agent import get_acne_agent

    agent = get_acne_agent()
    result = agent.analyze_image(image_b64)
    result["user_id"] = user_id
    return result


@tool
def get_acne_history(user_id: int, days: int = 30) -> dict:
    """
    Get historical acne severity records for a user over the last N days.
    Returns the trend (IMPROVING/STABLE/WORSENING) and historical records.
    """
    from ovacare.agents.acne_agent import get_acne_agent
    import random

    agent = get_acne_agent()

    # In production, query database for actual history
    # For now, generate synthetic history
    history = []
    for i in range(days):
        history.append({
            "day": i + 1,
            "severity": random.randint(0, 3),
            "date": f"2025-01-{(i % 28) + 1:02d}",
        })

    trend_result = agent.get_acne_trend(history)

    return {
        "user_id": user_id,
        "days_analyzed": days,
        "records": len(history),
        "trend": trend_result.get("trend", "UNKNOWN"),
        "avg_recent_severity": trend_result.get("avg_recent_severity", 0),
        "avg_older_severity": trend_result.get("avg_older_severity", 0),
    }

