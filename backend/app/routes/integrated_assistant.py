from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import base64
import httpx
import os
from langchain_core.messages import HumanMessage

# Import agents from our newly copied ovacare package
from ovacare.agents.risk_agent import get_risk_agent
from ovacare.agents.acne_agent import get_acne_agent
from ovacare.agents.progression_agent import get_progression_agent
from ovacare.graph.workflow import ovacare_graph
from ovacare.tools.progression_tools import _generate_synthetic_history

router = APIRouter(
    tags=["Integrated Assistant"]
)

# --- SCHEMAS ---

class RiskAssessRequest(BaseModel):
    user_id: int = Field(default=1)
    symptom_data: Dict[str, Any]

class AcneAnalyzeRequest(BaseModel):
    user_id: int = Field(default=1)
    image_b64: str

class ProgressionRequest(BaseModel):
    user_id: int = Field(default=1)
    # The user request said "same input shape as PCOS model"
    # So we accept the 10 fields here as well
    symptom_data: Optional[Dict[str, Any]] = None
    days: int = Field(default=30)

class ChatRequest(BaseModel):
    message: str
    user_id: int = Field(default=1)
    image_b64: Optional[str] = None

# --- ENDPOINTS ---

@router.post("/predict/acne")
async def predict_acne(request: AcneAnalyzeRequest):
    try:
        agent = get_acne_agent()
        result = agent.analyze_image(request.image_b64)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Acne analysis error: {str(e)}")

@router.post("/predict/pcos")
async def predict_pcos(request: RiskAssessRequest):
    try:
        agent = get_risk_agent()
        # Ensure reg.exercise_y_n is handled correctly if it comes from React with dot
        # symptom_data might already have it correctly mapped
        result = agent.assess_risk(request.symptom_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk assessment error: {str(e)}")

@router.post("/predict/progression")
async def predict_progression(request: ProgressionRequest):
    try:
        agent = get_progression_agent()
        # If user provides symptom_data, we can use it as the latest point
        # But for now, we follow the endpoints.py logic of synthetic history
        # or we can use the provided data if available.
        history = _generate_synthetic_history(request.user_id, request.days)
        
        # If symptom_data is provided, append it as the most recent day
        if request.symptom_data:
            # Map fields if necessary to match ProgressionAgent expectations
            # manual_test_progression uses cycle_irregularity, acne_severity, weight_gain
            # but user wants 10 fields. ProgressionAgent._rule_based_trend handles any float fields.
            history.append(request.symptom_data)
            
        result = agent.analyze_progression(history)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progression analysis error: {str(e)}")

@router.post("/chat")
@router.post("/assistant")
async def chat(request: ChatRequest):
    """
    Assistant proxy to LangGraph Dev Server (Streaming).
    DEPENDENCY: You MUST have 'langgraph dev' running on port 2024.
    """
    LANGGRAPH_URL = os.getenv("LANGGRAPH_DEV_URL", "http://localhost:2024")
    
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "assistant_id": "ovacare",
                "input": {
                    "messages": [{"role": "user", "content": request.message}],
                    "user_id": request.user_id,
                    "session_id": f"session_{request.user_id}",
                    "image_b64": request.image_b64
                },
                "stream_mode": "values"
            }
            
            final_values = {}
            async with client.stream("POST", f"{LANGGRAPH_URL}/runs/stream", json=payload, timeout=60.0) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    raise HTTPException(status_code=response.status_code, detail=f"LangGraph Error: {error_text.decode()}")
                
                async for line in response.aiter_lines():
                    if line.startswith("data:"):
                        import json
                        try:
                            data = json.loads(line[5:])
                            # In values mode, each event contains the current state
                            final_values = data
                        except:
                            continue
            
            return {
                "response": final_values.get("final_response") or "I'm sorry, I couldn't generate a response.",
                "intent": final_values.get("intent", "unknown"),
                "agents_called": final_values.get("agents_called", []),
                "risk_data": final_values.get("risk_result"),
                "acne_data": final_values.get("acne_result"),
                "progression_data": final_values.get("progression_result")
            }
            
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503, 
            detail="LangGraph Dev Server is not running on port 2024. Run 'langgraph dev' in ovacare-ai-assistant."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant Error: {str(e)}")
