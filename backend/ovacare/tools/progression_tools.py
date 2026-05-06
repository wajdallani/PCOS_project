# tools/progression_tools.py â€” LangChain tools for PCOS progression tracking

from langchain_core.tools import tool
from typing import Optional
import random


@tool
def analyze_progression(user_id: int, days: int = 30) -> dict:
    """
    Analyze PCOS progression over the last N days using the LSTM model.
    Returns trend_direction (IMPROVING/STABLE/WORSENING), confidence,
    detected patterns, and risk trajectory.
    """
    from ovacare.agents.progression_agent import get_progression_agent

    agent = get_progression_agent()

    # In production, fetch real symptom history from database
    # For now, generate synthetic 30-day data
    historical_data = _generate_synthetic_history(user_id, days)

    result = agent.analyze_progression(historical_data)
    result["user_id"] = user_id
    result["days_requested"] = days
    return result


@tool
def get_symptom_history(user_id: int, days: int = 30) -> dict:
    """
    Get raw symptom log history for a user over the last N days.
    Returns daily symptom entries with cycle data, lifestyle factors, etc.
    """
    # In production, this queries the database
    history = _generate_synthetic_history(user_id, days)

    return {
        "user_id": user_id,
        "days": days,
        "entries": len(history),
        "data": history[-5:],  # Return last 5 for display
        "summary": {
            "avg_bmi": sum(h.get("bmi", 25) for h in history) / len(history),
            "irregular_cycle_days": sum(1 for h in history if h.get("cycle_r_i", 0) > 2),
            "exercise_days": sum(1 for h in history if h.get("reg.exercise_y_n", 0) == 1),
        },
    }


def _generate_synthetic_history(user_id: int, days: int) -> list:
    """Generate synthetic symptom history for testing."""
    random.seed(user_id * 100)  # Reproducible per user
    history = []

    base_severity = 0.3 + (user_id % 3) * 0.2  # Different base per user

    for day in range(days):
        # Simulate cyclic variation (28-day cycle)
        cycle_day = day % 28
        cycle_factor = 1.0 + 0.3 * (1 if 21 <= cycle_day <= 28 else 0)  # Luteal spike

        entry = {
            "day": day + 1,
            "date": f"day_{day + 1}",
            "cycle_r_i": min(5, max(1, int(2 + random.gauss(0, 1) + cycle_factor))),
            "hair_growth_y_n": 1 if random.random() < base_severity else 0,
            "skin_darkening_y_n": 1 if random.random() < base_severity * 0.7 else 0,
            "pimples_y_n": 1 if random.random() < base_severity * cycle_factor else 0,
            "hair_loss_y_n": 1 if random.random() < base_severity * 0.5 else 0,
            "weight_gain_y_n": 1 if random.random() < base_severity * 0.6 else 0,
            "fast_food_y_n": 1 if random.random() < 0.4 else 0,
            "reg.exercise_y_n": 1 if random.random() < 0.3 else 0,
            "bmi": round(24 + random.gauss(0, 2) + base_severity * 3, 1),
            "age_yrs": 25 + user_id % 10,
        }
        history.append(entry)

    return history

