# api/endpoints.py â€” FastAPI backend with 4 endpoints

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from langchain_core.messages import HumanMessage

app = FastAPI(
    title="OvaCare PCOS AI Assistant",
    description="Multi-agent PCOS detection system with Risk, Acne, and Progression agents",
    version="1.0.0",
)

# CORS for Streamlit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class RiskAssessRequest(BaseModel):
    user_id: int = Field(default=1, description="Patient user ID")
    symptom_data: Dict[str, Any] = Field(
        default_factory=lambda: {
            "cycle_r_i": 4, "hair_growth_y_n": 1, "skin_darkening_y_n": 0,
            "pimples_y_n": 1, "hair_loss_y_n": 0, "weight_gain_y_n": 1,
            "fast_food_y_n": 1, "reg.exercise_y_n": 0, "bmi": 26.5, "age_yrs": 28,
        },
        description="Symptom data dictionary with 10 patient-reportable features",
    )

class AcneAnalyzeRequest(BaseModel):
    user_id: int = Field(default=1)
    image_b64: str = Field(..., description="Base64-encoded JPEG/PNG facial image")

class ProgressionRequest(BaseModel):
    user_id: int = Field(default=1)
    days: int = Field(default=30, description="Number of days of history to analyze")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    user_id: int = Field(default=1)
    image_b64: Optional[str] = Field(default=None, description="Optional base64 image for acne analysis")

class RiskResponse(BaseModel):
    risk_probability: float
    risk_level: str
    top_shap_features: List[Any]
    alert: bool
    disclaimer: str

class AcneResponse(BaseModel):
    severity: int
    severity_label: str
    confidence: float
    recommendations: List[str]
    disclaimer: Optional[str] = None

class ProgressionResponse(BaseModel):
    trend_direction: str
    trend_confidence: float
    pattern_detected: Optional[str] = None
    risk_trajectory: str
    model_used: str

class ChatResponse(BaseModel):
    response: str
    intent: str
    agents_called: List[str]
    risk_data: Optional[Dict[str, Any]] = None
    acne_data: Optional[Dict[str, Any]] = None
    progression_data: Optional[Dict[str, Any]] = None
    requires_human_review: bool = False


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# ENDPOINTS
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "OvaCare PCOS AI Assistant",
        "version": "1.0.0",
        "status": "running",
        "agents": ["risk", "acne", "progression"],
    }


@app.post("/api/risk/assess", response_model=RiskResponse)
async def assess_risk(request: RiskAssessRequest):
    """
    Assess PCOS risk from symptom data using LightGBM + SHAP.
    Returns risk probability, level, top contributing factors, and alert status.
    """
    try:
        from ovacare.agents.risk_agent import get_risk_agent

        agent = get_risk_agent()
        result = agent.assess_risk(request.symptom_data)

        return RiskResponse(
            risk_probability=result["risk_probability"],
            risk_level=result["risk_level"],
            top_shap_features=result["top_shap_features"],
            alert=result["alert"],
            disclaimer=result["disclaimer"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk assessment error: {str(e)}")


@app.post("/api/acne/analyze", response_model=AcneResponse)
async def analyze_acne(request: AcneAnalyzeRequest):
    """
    Analyze facial image for acne severity using EfficientNet-B0.
    Returns severity (0-3), confidence, and skincare recommendations.
    """
    try:
        from ovacare.agents.acne_agent import get_acne_agent

        agent = get_acne_agent()
        result = agent.analyze_image(request.image_b64)

        return AcneResponse(
            severity=result["severity"],
            severity_label=result["severity_label"],
            confidence=result["confidence"],
            recommendations=result["recommendations"],
            disclaimer=result.get("disclaimer"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Acne analysis error: {str(e)}")


@app.post("/api/progression/analyze", response_model=ProgressionResponse)
async def analyze_progression(request: ProgressionRequest):
    """
    Analyze PCOS progression over time using LSTM model.
    Returns trend direction, confidence, detected patterns, and risk trajectory.
    """
    try:
        from ovacare.tools.progression_tools import _generate_synthetic_history
        from ovacare.agents.progression_agent import get_progression_agent

        agent = get_progression_agent()
        history = _generate_synthetic_history(request.user_id, request.days)
        result = agent.analyze_progression(history)

        return ProgressionResponse(
            trend_direction=result["trend_direction"],
            trend_confidence=result["trend_confidence"],
            pattern_detected=result.get("pattern_detected"),
            risk_trajectory=result.get("risk_trajectory", "unknown"),
            model_used=result.get("model_used", "rule-based"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progression analysis error: {str(e)}")


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Full conversational endpoint — routes through LangGraph workflow.
    Detects intent, calls appropriate agent(s), returns synthesized response.
    """
    try:
        from ovacare.graph.workflow import ovacare_graph

        config = {"configurable": {"thread_id": f"user_{request.user_id}_session"}}

        initial_state = {
            "messages": [HumanMessage(content=request.message)],
            "user_id": request.user_id,
            "session_id": f"session_{request.user_id}",
            "intent": "",
            "agents_to_call": [],
            "agents_called": [],
            "user_profile": None,
            "language": "en",
            "image_b64": request.image_b64,         
            "risk_probability": None,
            "risk_level": None,
            "top_shap_features": None,
            "risk_result": None,
            "acne_severity": None,
            "acne_confidence": None,
            "acne_trend": None,
            "acne_result": None,
            "progression_trend": None,
            "progression_confidence": None,
            "pattern_detected": None,
            "risk_trajectory": None,
            "progression_result": None,
            "requires_human_review": False,
            "current_risk_prob": None,
            "final_response": None,
        }

        result = ovacare_graph.invoke(initial_state, config=config)

        # Deep cleaning for numpy types
        risk_result = result.get("risk_result")
        if isinstance(risk_result, dict):
            if "alert" in risk_result:
                risk_result["alert"] = bool(risk_result["alert"])
            if "risk_probability" in risk_result:
                risk_result["risk_probability"] = float(risk_result["risk_probability"])

        return ChatResponse(
            response=result.get("final_response") or 
                     result.get("messages", [{}])[-1].get("content", "No response generated."),
            intent=result.get("intent", "unknown"),
            agents_called=result.get("agents_called", []),
            risk_data=risk_result,
            acne_data=result.get("acne_result"),
            progression_data=result.get("progression_result"),
            requires_human_review=bool(result.get("requires_human_review", False)),
        )
    except Exception as e:  # <-- ADD THIS BLOCK
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")