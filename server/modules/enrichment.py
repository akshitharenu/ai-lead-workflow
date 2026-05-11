"""
Enrichment Module — looks up prior lead data in the CRM database.
"""


def enrich(email: str, db) -> dict:
    """
    Query the leads table for prior records with this email.
    Returns enrichment data for AI scoring context.
    """
    cursor = db.execute(
        "SELECT * FROM leads WHERE email = ? ORDER BY created_at DESC", (email,)
    )
    prior_leads = [dict(row) for row in cursor.fetchall()]

    return {
        "isReturning": len(prior_leads) > 0,
        "priorLeads": prior_leads,
        "leadCount": len(prior_leads),
        "lastContactDate": prior_leads[0]["created_at"] if prior_leads else None,
    }
