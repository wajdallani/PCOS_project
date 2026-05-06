# tests/test_agents.py â€” Integration tests for OvaCare agents

import sys
import os
import pytest

# Ensure project root is on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))


class TestRiskAgent:
    """Tests for the Risk Assessment Agent."""

    def test_risk_agent_loads(self):
        """RiskAgent should load models without error."""
        from ovacare.agents.risk_agent import get_risk_agent
        agent = get_risk_agent()
        assert agent.model is not None
        assert agent.imputer is not None
        assert agent.scaler is not None
        assert len(agent.feature_names) > 0

    def test_risk_agent_predict(self):
        """RiskAgent should return valid risk assessment."""
        from ovacare.agents.risk_agent import get_risk_agent
        agent = get_risk_agent()

        symptom_data = {
            "cycle_r_i": 4, "hair_growth_y_n": 1, "skin_darkening_y_n": 1,
            "pimples_y_n": 1, "hair_loss_y_n": 0, "weight_gain_y_n": 1,
            "fast_food_y_n": 1, "reg.exercise_y_n": 0, "bmi": 28.5, "age_yrs": 29,
        }
        result = agent.assess_risk(symptom_data)

        assert "risk_probability" in result
        assert "risk_level" in result
        assert "top_shap_features" in result
        assert 0.0 <= result["risk_probability"] <= 1.0
        assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
        assert len(result["top_shap_features"]) == 3

    def test_risk_agent_low_risk(self):
        """Healthy symptoms should return LOW risk."""
        from ovacare.agents.risk_agent import get_risk_agent
        agent = get_risk_agent()

        healthy = {
            "cycle_r_i": 1, "hair_growth_y_n": 0, "skin_darkening_y_n": 0,
            "pimples_y_n": 0, "hair_loss_y_n": 0, "weight_gain_y_n": 0,
            "fast_food_y_n": 0, "reg.exercise_y_n": 1, "bmi": 22.0, "age_yrs": 25,
        }
        result = agent.assess_risk(healthy)
        assert result["risk_probability"] < 0.65  # Should not be HIGH

    def test_risk_explanation(self):
        """RiskAgent explain_risk should return all feature explanations."""
        from ovacare.agents.risk_agent import get_risk_agent
        agent = get_risk_agent()

        symptom_data = {
            "cycle_r_i": 4, "hair_growth_y_n": 1, "skin_darkening_y_n": 0,
            "pimples_y_n": 1, "hair_loss_y_n": 0, "weight_gain_y_n": 1,
            "fast_food_y_n": 1, "reg.exercise_y_n": 0, "bmi": 26.5, "age_yrs": 28,
        }
        result = agent.explain_risk(symptom_data)
        assert "feature_explanations" in result
        assert "base_value" in result


class TestAcneAgent:
    """Tests for the Acne Severity Agent."""

    def test_acne_agent_loads(self):
        """AcneAgent should initialize without error."""
        from ovacare.agents.acne_agent import get_acne_agent
        agent = get_acne_agent()
        assert agent is not None

    def test_acne_mock_analyze(self):
        """AcneAgent mock should return valid structure."""
        from ovacare.agents.acne_agent import get_acne_agent
        agent = get_acne_agent()
        result = agent._mock_analyze()

        assert "severity" in result
        assert "severity_label" in result
        assert "confidence" in result
        assert "recommendations" in result
        assert 0 <= result["severity"] <= 3

    def test_acne_trend(self):
        """AcneAgent trend should detect trend from history."""
        from ovacare.agents.acne_agent import get_acne_agent
        agent = get_acne_agent()

        history = [{"severity": 3, "date": f"day_{i}"} for i in range(10)]
        history += [{"severity": 1, "date": f"day_{10+i}"} for i in range(10)]

        result = agent.get_acne_trend(history)
        assert result["trend"] in ["IMPROVING", "STABLE", "WORSENING"]


class TestProgressionAgent:
    """Tests for the Progression Tracking Agent."""

    def test_progression_agent_loads(self):
        """ProgressionAgent should initialize without error."""
        from ovacare.agents.progression_agent import get_progression_agent
        agent = get_progression_agent()
        assert agent is not None

    def test_progression_rule_based(self):
        """ProgressionAgent should work with rule-based fallback."""
        from ovacare.agents.progression_agent import get_progression_agent
        agent = get_progression_agent()

        history = []
        for i in range(30):
            history.append({
                "cycle_r_i": 2 + (i // 10),
                "bmi": 24 + i * 0.1,
                "pimples_y_n": 1 if i > 15 else 0,
            })

        result = agent.analyze_progression(history)
        assert "trend_direction" in result
        assert "trend_confidence" in result
        assert result["trend_direction"] in ["IMPROVING", "STABLE", "WORSENING", "INSUFFICIENT_DATA"]

    def test_progression_insufficient_data(self):
        """ProgressionAgent should handle empty data."""
        from ovacare.agents.progression_agent import get_progression_agent
        agent = get_progression_agent()

        result = agent.analyze_progression([])
        assert result["trend_direction"] == "INSUFFICIENT_DATA"


class TestTools:
    """Tests for LangChain tool functions."""

    def test_risk_tool(self):
        """get_preclinical_risk tool should return valid result."""
        from ovacare.tools.risk_tools import get_preclinical_risk
        result = get_preclinical_risk.invoke({"user_id": 1})

        assert result is not None
        assert "risk_level" in result
        assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

    def test_acne_history_tool(self):
        """get_acne_history tool should return trend."""
        from ovacare.tools.acne_tools import get_acne_history
        result = get_acne_history.invoke({"user_id": 1, "days": 30})

        assert result is not None
        assert "trend" in result

    def test_progression_tool(self):
        """analyze_progression tool should return trend."""
        from ovacare.tools.progression_tools import analyze_progression
        result = analyze_progression.invoke({"user_id": 1, "days": 30})

        assert result is not None
        assert "trend_direction" in result


class TestAPI:
    """Tests for FastAPI endpoints using TestClient."""

    def test_health_check(self):
        """Root endpoint should return service info."""
        from fastapi.testclient import TestClient
        from ovacare.api.endpoints import app

        client = TestClient(app)
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "running"
        assert "risk" in data["agents"]

    def test_risk_endpoint(self):
        """POST /api/risk/assess should return risk data."""
        from fastapi.testclient import TestClient
        from ovacare.api.endpoints import app

        client = TestClient(app)
        resp = client.post("/api/risk/assess", json={
            "user_id": 1,
            "symptom_data": {
                "cycle_r_i": 4, "hair_growth_y_n": 1, "skin_darkening_y_n": 0,
                "pimples_y_n": 1, "hair_loss_y_n": 0, "weight_gain_y_n": 1,
                "fast_food_y_n": 1, "reg.exercise_y_n": 0, "bmi": 26.5, "age_yrs": 28,
            },
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "risk_probability" in data
        assert "risk_level" in data

    def test_progression_endpoint(self):
        """POST /api/progression/analyze should return trend."""
        from fastapi.testclient import TestClient
        from ovacare.api.endpoints import app

        client = TestClient(app)
        resp = client.post("/api/progression/analyze", json={"user_id": 1, "days": 30})
        assert resp.status_code == 200
        data = resp.json()
        assert "trend_direction" in data

