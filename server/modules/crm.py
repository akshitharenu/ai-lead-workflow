"""
CRM Module — handles all database persistence for leads, events, and activity.
"""
import uuid
import json


class CRM:
    @staticmethod
    def create_lead(data: dict, db) -> dict:
        lead_id = str(uuid.uuid4())
        db.execute(
            """
            INSERT INTO leads (
                id, name, email, company, role, message,
                score, tier, intent, ai_summary, ai_reasoning,
                routing_queue, routing_priority, routing_sla,
                email_response, pipeline_duration_ms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                lead_id,
                data["name"],
                data["email"],
                data["company"],
                data.get("role"),
                data["message"],
                data.get("score"),
                data.get("tier"),
                data.get("intent"),
                data.get("ai_summary", data.get("summary")),
                data.get("ai_reasoning", data.get("reasoning")),
                data.get("routing_queue"),
                data.get("routing_priority"),
                data.get("routing_sla"),
                data.get("email_response"),
                data.get("pipeline_duration_ms"),
            ),
        )
        db.commit()
        return CRM.get_lead(lead_id, db)

    @staticmethod
    def get_lead(lead_id: str, db) -> dict | None:
        row = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
        if not row:
            return None
        lead = dict(row)

        events = db.execute(
            "SELECT * FROM pipeline_events WHERE lead_id = ? ORDER BY created_at ASC",
            (lead_id,),
        ).fetchall()
        lead["events"] = [dict(e) for e in events]
        return lead

    @staticmethod
    def get_all_leads(db, filters: dict | None = None) -> dict:
        filters = filters or {}
        query = "SELECT * FROM leads"
        params = []
        conditions = []

        if filters.get("tier"):
            conditions.append("tier = ?")
            params.append(filters["tier"])

        if filters.get("search"):
            conditions.append("(name LIKE ? OR company LIKE ? OR email LIKE ?)")
            s = f"%{filters['search']}%"
            params.extend([s, s, s])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY created_at DESC"

        # Pagination
        page = int(filters.get("page", 1))
        limit = int(filters.get("limit", 20))
        offset = (page - 1) * limit

        count_row = db.execute(
            f"SELECT COUNT(*) as cnt FROM ({query})", params
        ).fetchone()
        total = count_row["cnt"] if count_row else 0

        rows = db.execute(f"{query} LIMIT ? OFFSET ?", params + [limit, offset]).fetchall()
        leads = [dict(r) for r in rows]

        return {
            "leads": leads,
            "meta": {
                "total": total,
                "page": page,
                "pages": max(1, -(-total // limit)),  # ceil division
            },
        }

    @staticmethod
    def get_stats(db) -> dict:
        row = db.execute("""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN tier = 'hot' THEN 1 ELSE 0 END) as hot,
                SUM(CASE WHEN tier = 'warm' THEN 1 ELSE 0 END) as warm,
                SUM(CASE WHEN tier = 'cold' THEN 1 ELSE 0 END) as cold,
                SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) as today,
                AVG(score) as avgScore
            FROM leads
        """).fetchone()

        return {
            "total": row["total"] or 0,
            "hot": row["hot"] or 0,
            "warm": row["warm"] or 0,
            "cold": row["cold"] or 0,
            "today": row["today"] or 0,
            "avgScore": round((row["avgScore"] or 0), 1),
        }

    @staticmethod
    def log_event(lead_id: str, stage: str, status: str, data: dict | None, duration_ms: int, db):
        db.execute(
            "INSERT INTO pipeline_events (lead_id, stage, status, data, duration_ms) VALUES (?, ?, ?, ?, ?)",
            (lead_id, stage, status, json.dumps(data) if data else None, duration_ms),
        )
        db.commit()

    @staticmethod
    def log_activity(lead_id: str, level: str, module: str, message: str, db):
        db.execute(
            "INSERT INTO activity_log (lead_id, level, module, message) VALUES (?, ?, ?, ?)",
            (lead_id, level, module, message),
        )
        db.commit()
