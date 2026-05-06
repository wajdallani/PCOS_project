# graph/nodes.py — All LangGraph node functions

import sys
import io

# Force UTF-8 encoding for Windows console
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import re
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from ovacare.config.config import (
    settings, SUPERVISOR_PROMPT, RISK_AGENT_PROMPT,
    ACNE_AGENT_PROMPT, PROGRESSION_AGENT_PROMPT,
)
from ovacare.state.state import AgentState


# ──────────────────────────────────────────────────────────────
# Initialize LLM
# ──────────────────────────────────────────────────────────────

llm = ChatGroq(
    model=settings.LLM_MODEL,
    temperature=0.3,  # Lower = more consistent, professional responses
    api_key=settings.GROQ_API_KEY,
)


# ══════════════════════════════════════════════════════════════
# NODE 1: entry_node — Detect language
# ══════════════════════════════════════════════════════════════

def entry_node(state: AgentState) -> dict:
    """Entry point: Parse message, detect language, set user_id."""
    messages = state.get("messages", [])
    
    last_msg_content = ""
    if messages:
        last_msg = messages[-1]
        if hasattr(last_msg, "content"):
            last_msg_content = str(last_msg.content)
        elif isinstance(last_msg, dict):
            last_msg_content = str(last_msg.get("content", ""))
        else:
            last_msg_content = str(last_msg)

    msg_str = last_msg_content

    if re.search(r'[\u0600-\u06FF]', msg_str):
        language = "ar"
    elif _is_french(msg_str):
        language = "fr"
    else:
        language = "en"

    user_id = state.get("user_id", 1)
    print(f"[Entry Node] Language: {language}, User ID: {user_id}")

    return {
        "language": language,
        "user_id": user_id,
    }


def _is_french(text: str) -> bool:
    """Detect French more accurately — avoid false positives."""
    text_lower = text.lower()
    words = text_lower.split()

    strong_french = {"bonjour", "merci", "bonsoir", "allô", "salut",
                     "oui", "non", "votre", "vous", "nous", "ils",
                     "est-ce", "qu'est", "pourquoi", "comment", "quand"}

    weak_french = {"je", "mon", "les", "une", "des", "sur",
                   "dans", "avec", "pour", "pas", "plus", "bien"}

    strong_count = sum(1 for w in words if w in strong_french)
    weak_count = sum(1 for w in words if w in weak_french)

    return strong_count >= 1 or weak_count >= 2


# ══════════════════════════════════════════════════════════════
# NODE 2: intent_router (Supervisor) — Multi-agent routing
# ══════════════════════════════════════════════════════════════

def intent_router(state: AgentState) -> dict:
    """Supervisor: Classify intent and decide which agents to call."""
    messages = state.get("messages", [])
    
    last_msg_content = ""
    if messages:
        last_msg = messages[-1]
        if hasattr(last_msg, "content"):
            last_msg_content = str(last_msg.content)
        elif isinstance(last_msg, dict):
            last_msg_content = str(last_msg.get("content", ""))
        else:
            last_msg_content = str(last_msg)

    SUPERVISOR_SYSTEM_PROMPT = """You are a medical intent classifier for OvaCare, a PCOS health assistant.

Classify the user message and return which agents should handle it.

Available agents:
- "risk"        → PCOS risk, symptoms, irregular periods, weight gain, hair loss, 
                   hormones, fertility, cycle issues, diagnosis questions
- "acne"        → Skin condition, acne, pimples, face breakouts, skin analysis,
                   face photo, skincare advice, blackheads, hormonal acne, skin darkening
- "progression" → Trends over time, getting worse/better, tracking history,
                   progress report, changes over weeks/months, symptom patterns
- "general"     → Greetings, thanks, unrelated questions

MULTI-AGENT RULES:
- If message mentions BOTH risk symptoms AND acne → return: risk,acne
- If message mentions BOTH progression AND acne → return: progression,acne  
- If message mentions BOTH risk AND progression → return: risk,progression
- If message mentions ALL THREE → return: risk,acne,progression
- If only one topic → return just that one word
- For "general" → return: general (alone, never combined)

Return ONLY a comma-separated list of agent names.
Examples:
  "I have acne and irregular periods" → risk,acne
  "Is my acne getting worse?" → progression,acne
  "Do I have PCOS?" → risk
  "Hello!" → general
  "My acne is bad and my symptoms are worsening" → progression,acne"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", SUPERVISOR_SYSTEM_PROMPT),
        ("human", "{message}"),
    ])

    chain = prompt | llm

    try:
        response = chain.invoke({"message": last_msg_content})
        raw = response.content.strip().lower().replace('"', "").replace("'", "").replace(" ", "")

        valid_intents = {"risk", "acne", "progression", "general"}
        detected = []

        for item in raw.split(","):
            item = item.strip()
            if item in valid_intents:
                detected.append(item)

        detected = list(dict.fromkeys(detected))

        if not detected:
            detected = _keyword_fallback_multi(last_msg_content)

        if "general" in detected and len(detected) > 1:
            detected.remove("general")

        if not detected:
            detected = ["risk"]

    except Exception as e:
        print(f"[Supervisor] LLM error: {e} — using keyword fallback")
        detected = _keyword_fallback_multi(last_msg_content)

    primary_intent = detected[0]
    agents_to_call = detected if detected != ["general"] else ["risk"]

    print(f"[Supervisor] Intent: {primary_intent}, Agents: {agents_to_call}")

    return {
        "intent": primary_intent,
        "agents_to_call": agents_to_call,
    }


def _keyword_fallback_multi(message: str) -> list:
    """Multi-intent keyword fallback when LLM fails."""
    msg_lower = message.lower()
    detected = []

    if any(w in msg_lower for w in ["acne", "pimple", "skin", "face", "breakout", "blackhead"]):
        detected.append("acne")

    if any(w in msg_lower for w in ["trend", "progress", "worse", "better", "history", "over time", "track", "worsening", "improving"]):
        detected.append("progression")

    if any(w in msg_lower for w in ["risk", "pcos", "symptom", "irregular", "cycle", "bmi", "weight", "hair", "period"]):
        detected.append("risk")

    if not detected:
        if any(w in msg_lower for w in ["hello", "hi", "thanks", "thank"]):
            return ["general"]
        return ["risk"]

    return detected


# ══════════════════════════════════════════════════════════════
# NODE 3: risk_agent_node — Assess PCOS risk
# ══════════════════════════════════════════════════════════════

def risk_agent_node(state: AgentState) -> dict:
    """Risk Agent: Gather PCOS risk data using LightGBM + SHAP."""
    from ovacare.tools.risk_tools import get_preclinical_risk

    user_id = state.get("user_id", 1)
    risk_data = get_preclinical_risk.invoke({"user_id": user_id})

    print(f"[Risk Agent] Level: {risk_data.get('risk_level')}, Prob: {risk_data.get('risk_probability')}")

    return {
        "risk_result": risk_data,
        "risk_probability": float(risk_data.get("risk_probability", 0.0)),
        "risk_level": risk_data.get("risk_level", "UNKNOWN"),
        "top_shap_features": risk_data.get("top_feature_names", []),
        "current_risk_prob": float(risk_data.get("risk_probability", 0.0)),
        "agents_called": state.get("agents_called", []) + ["risk"],
    }


# ══════════════════════════════════════════════════════════════
# NODE 4: acne_agent_node — Use image OR history
# ══════════════════════════════════════════════════════════════

def acne_agent_node(state: AgentState) -> dict:
    """Acne Agent: Analyze uploaded image OR fetch acne history."""
    from ovacare.tools.acne_tools import analyze_acne_image, get_acne_history
    from ovacare.agents.acne_agent import get_acne_agent

    user_id = state.get("user_id", 1)
    image_b64 = state.get("image_b64")

    acne_image_result = None
    acne_history = None

    if image_b64:
        print("[Acne Agent] Image provided, running visual analysis")
        try:
            agent = get_acne_agent()
            acne_image_result = agent.analyze_image(image_b64)
            print(f"  → Severity: {acne_image_result.get('severity_label')}, Confidence: {acne_image_result.get('confidence')}")
        except Exception as e:
            print(f"  [Error] Image analysis failed: {e}")

    try:
        acne_history = get_acne_history.invoke({"user_id": user_id, "days": 30})
        print(f"[Acne Agent] History trend: {acne_history.get('trend')}")
    except Exception as e:
        print(f"  [Error] History fetch failed: {e}")
        acne_history = {"trend": "UNKNOWN"}

    acne_result = {
        **(acne_history or {}),
        "image_analysis": acne_image_result,
    }

    return {
        "acne_result": acne_result,
        "acne_trend": acne_history.get("trend", "UNKNOWN") if acne_history else "UNKNOWN",
        "acne_severity": int(acne_image_result.get("severity")) if acne_image_result else None,
        "acne_confidence": float(acne_image_result.get("confidence")) if acne_image_result else None,
        "agents_called": state.get("agents_called", []) + ["acne"],
    }


# ══════════════════════════════════════════════════════════════
# NODE 5: progression_agent_node — Track PCOS trends
# ══════════════════════════════════════════════════════════════

def progression_agent_node(state: AgentState) -> dict:
    """Progression Agent: Track PCOS trends using LSTM."""
    from ovacare.tools.progression_tools import analyze_progression

    user_id = state.get("user_id", 1)
    progression_data = analyze_progression.invoke({"user_id": user_id, "days": 30})

    print(f"[Progression Agent] Trend: {progression_data.get('trend_direction')}, Confidence: {progression_data.get('trend_confidence')}")

    return {
        "progression_result": progression_data,
        "progression_trend": progression_data.get("trend_direction", "UNKNOWN"),
        "progression_confidence": float(progression_data.get("trend_confidence", 0.0)),
        "pattern_detected": progression_data.get("pattern_detected"),
        "risk_trajectory": progression_data.get("risk_trajectory", "unknown"),
        "agents_called": state.get("agents_called", []) + ["progression"],
    }


# ══════════════════════════════════════════════════════════════
# NODE 6: safety_node — Check if high risk needs human review
# ══════════════════════════════════════════════════════════════

def safety_node(state: AgentState) -> dict:
    """Safety gate: Flag critical risk scores for human review."""
    risk_prob = state.get("current_risk_prob") or state.get("risk_probability") or 0.0
    progression_trend = state.get("progression_trend", "STABLE")

    requires_review = False
    reasons = []

    if risk_prob and risk_prob >= settings.RISK_CRITICAL_THRESHOLD:
        requires_review = True
        reasons.append(f"Critical risk probability: {risk_prob:.0%}")

    if progression_trend == "WORSENING":
        reasons.append("Symptoms are worsening over time")

    acne_severity = state.get("acne_severity")
    if acne_severity and acne_severity >= 3:
        reasons.append("Severe acne detected")

    print(f"[Safety Node] Risk: {risk_prob}, Review: {requires_review}, Reasons: {reasons}")

    return {
        "requires_human_review": requires_review,
    }


# ══════════════════════════════════════════════════════════════
# NODE 7: synthesis_node — LLM-Powered Response Generation (FIXED)
# ══════════════════════════════════════════════════════════════

def synthesis_node(state: AgentState) -> dict:
    """
    Synthesis: Use LLM to merge all agent outputs into a personalized,
    conversational response with proper structure and empathy.
    Includes safety check before returning.
    """
    risk_result = state.get("risk_result")
    acne_result = state.get("acne_result")
    progression_result = state.get("progression_result")
    requires_review = state.get("requires_human_review", False)
    agents_called = state.get("agents_called", [])
    language = state.get("language", "en")

    print(f"[Synthesis] Starting synthesis... agents called: {agents_called}")

    # =====================
    # BUILD CONTEXT DATA
    # =====================
    context_summary = []

    if risk_result and "risk" in agents_called:
        prob = float(risk_result.get("risk_probability", 0.0))
        level = risk_result.get("risk_level", "Unknown")
        factors = risk_result.get("top_shap_features", [])
        
        # Extract factor names cleanly
        factor_text = ", ".join(
            f["feature"].replace("_", " ") 
            for f in factors[:3]
            if isinstance(f, dict) and "feature" in f
        ) or "various lifestyle factors"
        
        context_summary.append(
            f"**Risk Level: {level} ({prob:.0%} probability)**. "
            f"Main contributors: {factor_text}."
        )

    if acne_result and "acne" in agents_called:
        trend = acne_result.get("trend", "Unknown")
        avg_sev = acne_result.get("avg_recent_severity")
        image_analysis = acne_result.get("image_analysis")
        
        image_info = ""
        if image_analysis:
            sev_label = image_analysis.get("severity_label", "Unknown")
            conf = image_analysis.get("confidence", 0)
            image_info = f"(visual analysis: {sev_label}, {conf:.0%} confidence)"
        
        context_summary.append(
            f"**Acne: Trend is {trend}** {image_info}. "
            f"Recent average severity: {avg_sev}/3" if avg_sev else "Recent average severity: N/A"
        )

    if progression_result and "progression" in agents_called:
        trend_dir = progression_result.get("trend_direction", "Unknown")
        conf = float(progression_result.get("trend_confidence", 0))
        pattern = progression_result.get("pattern_detected")
        
        pattern_info = f" (pattern: {pattern})" if pattern else ""
        context_summary.append(
            f"**Progression: {trend_dir}** (confidence: {conf:.0%}){pattern_info}."
        )

    context_text = " | ".join(context_summary) if context_summary else "No assessment data available."

    print(f"[Synthesis] Context built: {context_text[:200]}...")

    # =====================
    # BUILD PROMPT
    # =====================
    SYNTHESES_SYSTEM_PROMPT = f"""You are OvaCare, an empathetic AI assistant specialized in women's health and PCOS monitoring.

YOUR TASK: Generate a warm, professional, personalized response based on the medical assessment data provided below.

RULES:
- Use markdown formatting (headings ##, bullets •, bold **)
- Be empathetic and supportive — never cold or robotic
- Include 2-3 specific actionable recommendations
- Always end with a medical disclaimer
- If user has HIGH risk, clearly recommend seeing a gynecologist within the main body
- Organize findings by priority (most important first)
- Keep language simple and clear — avoid jargon
- Match the detected language: {language}

OUTPUT STRUCTURE:
1. Warm greeting acknowledging their concern
2. Key findings summary (with emojis for visual appeal)
3. Recommendations section
4. Medical disclaimer

When language is 'en' respond in English. When 'fr' respond in French. When 'ar' respond in Arabic."""

    safety_note = "🚨 URGENT: User has HIGH or CRITICAL risk level requiring immediate medical attention." if requires_review else "No urgent safety concerns flagged."

    human_message = f"""Medical Assessment Results:
{context_text}

Safety Flags: {safety_note}

Generate a compassionate, well-structured patient summary.
Make sure to:
- Thank the user for sharing their concerns
- Clearly summarize what was found
- Give practical next steps
- End with appropriate disclaimer"""

    # =====================
    # CALL LLM WITH DEBUGGING
    # =====================
    synthesized_text = ""
    llm_used = False
    
    try:
        print("[Synthesis] Invoking LLM...")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYNTHESES_SYSTEM_PROMPT),
            ("human", human_message),
        ])
        
        chain = prompt | llm
        
        # Add timeout for robustness
        from langchain_core.callbacks import CallbackManager
        callback_manager = CallbackManager([])
        
        response = chain.invoke({}, config={"callbacks": callback_manager})
        
        if response and hasattr(response, "content"):
            synthesized_text = response.content.strip()
            llm_used = True
            print(f"[Synthesis] ✅ LLM succeeded! Generated {len(synthesized_text)} characters")
        else:
            raise ValueError("LLM returned empty or invalid response")
        
    except Exception as e:
        print(f"[Synthesis] ⚠️ LLM failed: {type(e).__name__}: {str(e)[:200]}")
        print("[Synthesis] Using fallback template instead")
        synthesized_text = _fallback_template(risk_result, acne_result, progression_result, 
                                               requires_review, language, agents_called)

    # =====================
    # SAFETY CHECK BEFORE RETURNING
    # =====================
    if requires_review and llm_used:
        # Check if emergency recommendation was already included
        if "doctor" not in synthesized_text.lower() and "gynecologist" not in synthesized_text.lower() and "medical consultation" not in synthesized_text.lower():
            print("[Synthesis] Adding missing safety alert for high-risk case")
            
            if language == "ar":
                safety_addition = "\n\n🚨 **تنبيه مهم:** نتائجك تشير إلى ضرورة مراجعة طبيب على الفور."
            elif language == "fr":
                safety_addition = "\n\n🚨 **IMPORTANT:** Vos résultats indiquent que vous devez consulter un médecin dès que possible."
            else:
                safety_addition = "\n\n🚨 **IMPORTANT:** Your results indicate you should see a doctor as soon as possible."
            
            # Insert before the disclaimer
            disclaimer_marker = "⚠️ *This is a risk indicator"
            if disclaimer_marker in synthesized_text:
                parts = synthesized_text.split(disclaimer_marker)
                synthesized_text = parts[0] + safety_addition + "\n\n" + disclaimer_marker + parts[1][len("*"):]
            else:
                synthesized_text += safety_addition

    print(f"[Synthesis Node] Complete. Used LLM: {llm_used}, agents: {len(agents_called)}")

    return {
        "final_response": synthesized_text,
        "messages": [AIMessage(content=synthesized_text)],
    }


def _fallback_template(risk_result, acne_result, progression_result, 
                       requires_review, language, agents_called):
    """Static fallback when LLM fails."""
    parts = []

    if risk_result and "risk" in agents_called:
        level_emoji = {"LOW": "🟢", "MEDIUM": "🟡", "HIGH": "🔴"}.get(risk_result.get("risk_level"), "⚪")
        parts.append(f"## {level_emoji} Risk Assessment: **{risk_result.get('risk_level', 'Unknown')}**")
        parts.append(f"**Probability:** {float(risk_result.get('risk_probability', 0)):.0%}")

    if acne_result and "acne" in agents_called:
        parts.append(f"\n## 🧴 Acne Analysis")
        parts.append(f"**Trend:** {acne_result.get('trend', 'Unknown')}")

    if progression_result and "progression" in agents_called:
        trend_emoji = {"IMPROVING": "📈", "STABLE": "➡️", "WORSENING": "📉"}.get(progression_result.get("trend_direction"), "❓")
        parts.append(f"\n## {trend_emoji} Progression Analysis")
        parts.append(f"**Trend:** {progression_result.get('trend_direction', 'Unknown')}")

    if requires_review:
        parts.append("\n\n🚨 **IMPORTANT:** Your results indicate you should see a doctor as soon as possible.")

    if language == "ar":
        parts.append("\n\n⚠️ *هذا التقييم هو مؤشر مساعد، وليس تشخيصاً طبياً.*")
    elif language == "fr":
        parts.append("\n\n⚠️ *Ceci est un indicateur de risque, pas un diagnostic médical.*")
    else:
        parts.append("\n\n⚠️ *This is a risk indicator, not a medical diagnosis.*")

    return "\n".join(parts) if parts else "Unable to process request. Please try again."


# ══════════════════════════════════════════════════════════════
# NODE 8: general_node — Handle greetings and unrelated queries
# ══════════════════════════════════════════════════════════════

def general_node(state: AgentState) -> dict:
    """Handle general/unrelated queries with a friendly response."""
    messages = state.get("messages", [])
    
    last_msg_content = ""
    if messages:
        last_msg = messages[-1]
        if hasattr(last_msg, "content"):
            last_msg_content = str(last_msg.content)
        elif isinstance(last_msg, dict):
            last_msg_content = str(last_msg.get("content", ""))
        else:
            last_msg_content = str(last_msg)
    
    language = state.get("language", "en")

    if language == "ar":
        response = (
            "مرحباً! أنا OvaCare، مساعدك الذكي لصحة المرأة.\n\n"
            "يمكنني مساعدتك في:\n"
            "• تقييم خطر متلازمة تكيس المبايض\n"
            "• تحليل حالة البشرة والحبوب\n"
            "• تتبع تطور الأعراض عبر الزمن\n\n"
            "كيف يمكنني مساعدتك اليوم؟"
        )
    elif language == "fr":
        response = (
            "Bonjour! Je suis OvaCare, votre assistant santé féminine.\n\n"
            "Je peux vous aider avec:\n"
            "• Évaluation du risque SOPK\n"
            "• Analyse de l'acné et de la peau\n"
            "• Suivi de la progression des symptômes\n\n"
            "Comment puis-je vous aider aujourd'hui?"
        )
    else:
        response = (
            "Hello! I'm OvaCare, your AI-powered women's health assistant. 👋\n\n"
            "I can help you with:\n"
            "• 🔴 **PCOS Risk Assessment** — Check your symptoms\n"
            "• 🧴 **Acne Analysis** — Upload a photo or describe your skin\n"
            "• 📈 **Progression Tracking** — See if symptoms are improving\n\n"
            "What would you like to know today?"
        )

    print(f"[General Node] Responding in: {language}")

    return {
        "final_response": response,
        "agents_called": [],
        "messages": [AIMessage(content=response)],
    }