# graphs/risk_graph.py

from langgraph.graph import StateGraph, END
from agents.risk_agent import RiskAgent, RiskAgentState

def create_risk_graph():
    """Create the Risk Agent's internal workflow graph"""
    
    risk_agent = RiskAgent()
    
    workflow = StateGraph(RiskAgentState)
    
    # Add nodes
    workflow.add_node("assess_risk", risk_agent.assess_risk)
    workflow.add_node("check_alert", check_alert_threshold)
    workflow.add_node("format_response", format_risk_response)
    
    # Define edges
    workflow.set_entry_point("assess_risk")
    workflow.add_edge("assess_risk", "check_alert")
    workflow.add_edge("check_alert", "format_response")
    workflow.add_edge("format_response", END)
    
    return workflow.compile()

def check_alert_threshold(state: RiskAgentState) -> RiskAgentState:
    """Check if risk level triggers alert"""
    if state['risk_probability'] >= 0.90:
        # Critical - immediate doctor referral
        state['messages'].append({
            'type': 'critical_alert',
            'message': 'High risk detected. Please consult a doctor immediately.'
        })
    elif state['risk_probability'] >= 0.65:
        # High - push notification
        state['messages'].append({
            'type': 'high_risk_alert',
            'message': 'Your symptoms suggest elevated PCOS risk.'
        })
    
    return state

def format_risk_response(state: RiskAgentState) -> RiskAgentState:
    """Format the risk assessment for patient-facing response"""
    response = {
        'risk_level': state['risk_level'],
        'probability': f"{state['risk_probability']:.1%}",
        'top_factors': state['top_features'],
        'trend': state['trend_direction'],
        'disclaimer': "This is a risk indicator, not a medical diagnosis."
    }
    
    state['messages'].append({
        'type': 'risk_assessment',
        'content': response
    })
    
    return state
