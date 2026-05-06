class FusionService:
    @staticmethod
    def calculate_risk(p_tabular, p_image):
        final_risk = 0.7 * p_tabular + 0.3 * p_image
        
        if final_risk < 0.4:
            risk_level = "Low"
        elif final_risk < 0.7:
            risk_level = "Moderate"
        else:
            risk_level = "High"
            
        return {
            "p_tabular": float(p_tabular),
            "p_image": float(p_image),
            "final_risk": float(final_risk),
            "risk_level": risk_level
        }
