"""
Router Module — determines lead routing based on score and intent.
Pure logic, no I/O.
"""


def route(score: int, intent: str) -> dict:
    """
    Route a lead based on its score and intent.
    Applies intent boost for 'purchase' or 'demo'.
    """
    final_score = score

    if intent in ("purchase", "demo"):
        final_score = min(10, score + 1)

    if final_score >= 8:
        return {
            "priority": "high",
            "queue": "Enterprise Sales",
            "sla": "1h",
            "action": "immediate_outreach",
            "finalScore": final_score,
        }
    elif final_score >= 5:
        return {
            "priority": "medium",
            "queue": "SDR Team",
            "sla": "4h",
            "action": "scheduled_followup",
            "finalScore": final_score,
        }
    else:
        return {
            "priority": "low",
            "queue": "Marketing Nurture",
            "sla": "24h",
            "action": "drip_sequence",
            "finalScore": final_score,
        }
