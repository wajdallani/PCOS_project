# state/state.py â€” Expanded AgentState for 3-agent system

from typing import TypedDict, Annotated, Optional, List
from langchain_core.messages import BaseMessage
import operator


class AgentState(TypedDict):
    """
    Central state shared across ALL nodes in the LangGraph workflow.
    Uses Annotated[list, operator.add] for message accumulation.
    """

    # â”€â”€ Core â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    messages: Annotated[List[BaseMessage], operator.add]
    user_id: int
    session_id: str
    intent: str  # detected intent: risk | acne | progression | general

    # â”€â”€ Routing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    agents_to_call: List[str]   # router decision
    agents_called: List[str]    # audit trail

    # â”€â”€ User context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    user_profile: Optional[dict]
    language: str  # 'en' | 'fr' | 'ar'
    image_b64: Optional[str] 

    # â”€â”€ Risk Agent outputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    risk_probability: Optional[float]       # 0.0 - 1.0
    risk_level: Optional[str]               # LOW | MEDIUM | HIGH
    top_shap_features: Optional[List[str]]  # top 3 SHAP features
    risk_result: Optional[dict]             # full risk response dict

    # â”€â”€ Acne Agent outputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    acne_severity: Optional[int]            # 0-3 (None/Mild/Moderate/Severe)
    acne_confidence: Optional[float]        # 0.0 - 1.0
    acne_trend: Optional[str]              # IMPROVING | STABLE | WORSENING
    acne_result: Optional[dict]            # full acne response dict

    # â”€â”€ Progression Agent outputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    progression_trend: Optional[str]        # IMPROVING | STABLE | WORSENING
    progression_confidence: Optional[float] # 0.0 - 1.0
    pattern_detected: Optional[str]         # e.g. "luteal_phase_spike"
    risk_trajectory: Optional[str]          # decreasing | stable | increasing
    progression_result: Optional[dict]      # full progression response dict

    # â”€â”€ Safety & Control â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    requires_human_review: bool
    current_risk_prob: Optional[float]

    # â”€â”€ Final output â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    final_response: Optional[str]
