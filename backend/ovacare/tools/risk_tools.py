# tools/risk_tools.py â€” Real LangChain tools for risk assessment

from langchain_core.tools import tool
from typing import Optional


@tool
def get_preclinical_risk(user_id: int, symptom_data: Optional[dict] = None) -> dict:
    """
    Assess preclinical PCOS risk using the LightGBM model.
    Takes a user_id and optional symptom_data dict.
    Returns risk_probability, risk_level, top_shap_features, and alert status.
    
    symptom_data keys: cycle_r_i, hair_growth_y_n, skin_darkening_y_n,
    pimples_y_n, hair_loss_y_n, weight_gain_y_n, fast_food_y_n,
    reg.exercise_y_n, bmi, age_yrs
    """
    from ovacare.agents.risk_agent import get_risk_agent

    agent = get_risk_agent()

    # Use provided data or generate default test data
    if symptom_data is None:
        symptom_data = _get_default_symptom_data(user_id)

    result = agent.assess_risk(symptom_data)
    return result


@tool
def get_risk_explanation(user_id: int, symptom_data: Optional[dict] = None) -> dict:
    """
    Get detailed SHAP explanation for PCOS risk factors.
    Returns per-feature SHAP values explaining why each factor
    increases or decreases risk.
    """
    from ovacare.agents.risk_agent import get_risk_agent

    agent = get_risk_agent()

    if symptom_data is None:
        symptom_data = _get_default_symptom_data(user_id)

    return agent.explain_risk(symptom_data)


@tool
def get_user_profile(user_id: int) -> dict:
    """
    Get user profile information for personalized risk assessment.
    Returns name, age, bmi, pcos_stage, and language preference.
    """
    # In production this would query a database
    # For now return synthetic profile data
    profiles = {
        1: {"name": "Test User", "age": 28, "bmi": 24.5, "pcos_stage": "preclinical", "language": "en"},
        2: {"name": "Sarah", "age": 32, "bmi": 27.8, "pcos_stage": "diagnosed", "language": "en"},
        3: {"name": "Fatima", "age": 25, "bmi": 22.1, "pcos_stage": "preclinical", "language": "ar"},
    }
    return profiles.get(user_id, profiles[1])


def _get_default_symptom_data(user_id: int) -> dict:
    """Default symptom data for testing when no data is provided."""
    defaults = {
        1: {
            "cycle_r_i": 4, "hair_growth_y_n": 1, "skin_darkening_y_n": 0,
            "pimples_y_n": 1, "hair_loss_y_n": 0, "weight_gain_y_n": 1,
            "fast_food_y_n": 1, "reg.exercise_y_n": 0, "bmi": 26.5, "age_yrs": 28,
        },
        2: {
            "cycle_r_i": 2, "hair_growth_y_n": 0, "skin_darkening_y_n": 0,
            "pimples_y_n": 0, "hair_loss_y_n": 0, "weight_gain_y_n": 0,
            "fast_food_y_n": 0, "reg.exercise_y_n": 1, "bmi": 22.0, "age_yrs": 25,
        },
    }
    return defaults.get(user_id, defaults[1])
