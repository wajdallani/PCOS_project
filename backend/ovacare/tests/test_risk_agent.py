import pytest
from ovacare.tools.risk_tools import get_preclinical_risk, get_symptom_history, get_user_profile

class TestRiskTools:
    def test_get_preclinical_risk_tool(self):
        """Test the get_preclinical_risk tool function"""
        result = get_preclinical_risk.invoke({"user_id": 123})
        
        # Check if result is not None
        assert result is not None, "Tool returned None. Check if risk_tools.py has mock data."
        assert "risk_level" in result
        assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

    def test_get_symptom_history_tool(self):
        """Test symptom history retrieval tool"""
        result = get_symptom_history.invoke({"user_id": 123, "days": 30})
        
        assert result is not None, "Tool returned None."
        assert "logs" in result
        assert "trend" in result
        assert result["trend"] in ["IMPROVING", "STABLE", "WORSENING"]

    def test_get_user_profile_tool(self):
        """Test user profile retrieval tool"""
        result = get_user_profile.invoke({"user_id": 123})
        
        assert result is not None, "Tool returned None."
        assert "name" in result
        assert "age" in result
