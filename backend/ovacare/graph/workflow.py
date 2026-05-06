# graph/workflow.py — Multi-agent LangGraph with supervisor routing

from langgraph.graph import StateGraph, END
from ovacare.state.state import AgentState
import sys
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from ovacare.graph.nodes import (
    entry_node,
    intent_router,
    risk_agent_node,
    acne_agent_node,
    progression_agent_node,
    safety_node,
    synthesis_node,
    general_node,
)


# ══════════════════════════════════════════════════════════════
# DISPATCHER — Runs all needed agents sequentially
# ══════════════════════════════════════════════════════════════

def agent_dispatcher(state: AgentState) -> dict:
    """
    Dispatcher: Runs each required agent in sequence.
    Merges all results into state.
    """
    agents_to_call = state.get("agents_to_call", ["risk"])
    print(f"Dispatcher — Running agents: {agents_to_call}")

    merged_state = {}
    agents_called = []

    for agent_name in agents_to_call:
        try:
            if agent_name == "risk":
                result = risk_agent_node(state)
                merged_state.update(result)
                agents_called.append("risk")

            elif agent_name == "acne":
                result = acne_agent_node(state)
                merged_state.update(result)
                agents_called.append("acne")

            elif agent_name == "progression":
                result = progression_agent_node(state)
                merged_state.update(result)
                agents_called.append("progression")

            print(f" {agent_name}_agent completed")

        except Exception as e:
            print(f" {agent_name}_agent failed: {e}")

    merged_state["agents_called"] = agents_called
    print(f"Dispatcher — Completed: {agents_called}")
    return merged_state


# ══════════════════════════════════════════════════════════════
# ROUTING FUNCTION — After supervisor decision
# ══════════════════════════════════════════════════════════════

def route_after_supervisor(state: AgentState) -> str:
    """
    After supervisor classifies intent:
    - general → go directly to general_node (no agents)
    - anything else → go to dispatcher
    """
    intent = state.get("intent", "risk")

    if intent == "general":
        print("Routing → general_node")
        return "general"
    else:
        print(" Routing → dispatcher")
        return "dispatcher"


# ══════════════════════════════════════════════════════════════
# GRAPH BUILDER
# ══════════════════════════════════════════════════════════════

def build_ovacare_graph():
    """
    Build and compile the multi-agent LangGraph workflow.

    Flow:
        START
          ↓
        entry_node     (language detection)
          ↓
        supervisor     (multi-agent intent classification)
          ↓
        [conditional]──── general → general_node → END
          │
          └─── dispatcher (risk + acne + progression as needed)
                  ↓
               safety_node
                  ↓
               synthesis_node
                  ↓
                 END
    """
    graph = StateGraph(AgentState)

    # ── Add all nodes ──────────────────────────────────────────
    graph.add_node("entry",      entry_node)
    graph.add_node("supervisor", intent_router)
    graph.add_node("dispatcher", agent_dispatcher)
    graph.add_node("safety",     safety_node)
    graph.add_node("synthesis",  synthesis_node)
    graph.add_node("general",    general_node)

    # ── Entry flow ─────────────────────────────────────────────
    graph.set_entry_point("entry")
    graph.add_edge("entry", "supervisor")

    # ── Conditional: general vs agents ────────────────────────
    graph.add_conditional_edges(
        "supervisor",
        route_after_supervisor,
        {
            "general":    "general",
            "dispatcher": "dispatcher",
        }
    )

    # ── Agent flow ─────────────────────────────────────────────
    graph.add_edge("dispatcher", "safety")
    graph.add_edge("safety",     "synthesis")
    graph.add_edge("synthesis",  END)

    # ── General flow ───────────────────────────────────────────
    graph.add_edge("general", END)

    app = graph.compile()

    print("OvaCare graph compiled — Multi-agent supervisor ready")
    print("   Flow: entry → supervisor → [general|dispatcher] → synthesis → END")

    return app


# Global instance
ovacare_graph = build_ovacare_graph()