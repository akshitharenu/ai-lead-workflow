"""
Orchestrator — coordinates the full lead processing pipeline.
"""
import time
import uuid
from config.logger import logger
from modules.validator import validate
from modules.enrichment import enrich
from modules.ai_scorer import score_lead_ai
from modules.ai_responder import generate_response_ai
from modules.router import route
from modules.crm import CRM
from utils.api_error import ApiError


def run_pipeline(form_data: dict, db) -> dict:
    """
    Execute the full 7-stage lead processing pipeline.
    Returns the complete result object.
    """
    start_time = time.time()
    temp_lead_id = str(uuid.uuid4())
    stages = {}

    def execute_stage(name, fn):
        stage_start = time.time()
        logger.info(f"Starting stage: {name}")
        try:
            result = fn()
            duration = int((time.time() - stage_start) * 1000)
            stages[name] = {"status": "done", "durationMs": duration, "data": None}
            CRM.log_event(temp_lead_id, name, "done", None, duration, db)
            return result
        except Exception as e:
            duration = int((time.time() - stage_start) * 1000)
            stages[name] = {"status": "error", "durationMs": duration, "error": str(e)}
            CRM.log_event(temp_lead_id, name, "error", {"error": str(e)}, duration, db)
            raise

    try:
        # 1+2. VALIDATE
        validated_data = execute_stage("VALIDATE", lambda: _validate_stage(form_data))

        # 3. ENRICH
        enrich_result = execute_stage("ENRICH", lambda: enrich(validated_data["email"], db))

        # 4. SCORE
        scoring = execute_stage("SCORE", lambda: score_lead_ai(validated_data, enrich_result))

        # 5. ROUTE
        routing = execute_stage("ROUTE", lambda: route(scoring["score"], scoring["intent"]))

        # 6. RESPOND
        email_body = execute_stage(
            "RESPOND", lambda: generate_response_ai(validated_data, scoring)
        )

        pipeline_duration_ms = int((time.time() - start_time) * 1000)

        # 7. SAVE
        lead_record = execute_stage(
            "SAVE",
            lambda: CRM.create_lead(
                {
                    **validated_data,
                    **scoring,
                    "routing_queue": routing["queue"],
                    "routing_priority": routing["priority"],
                    "routing_sla": routing["sla"],
                    "email_response": email_body,
                    "pipeline_duration_ms": pipeline_duration_ms,
                },
                db,
            ),
        )

        # Re-link events from temp ID to real ID
        db.execute(
            "UPDATE pipeline_events SET lead_id = ? WHERE lead_id = ?",
            (lead_record["id"], temp_lead_id),
        )
        db.commit()

        return {
            "leadId": lead_record["id"],
            "scoring": scoring,
            "routing": routing,
            "emailBody": email_body,
            "pipelineDurationMs": pipeline_duration_ms,
            "stages": stages,
        }

    except Exception as e:
        failed_stage = list(stages.keys())[-1] if stages else "UNKNOWN"
        logger.error(f"Pipeline failed at stage: {failed_stage} — {e}")
        raise


def _validate_stage(form_data: dict) -> dict:
    result = validate(form_data)
    if not result["valid"]:
        raise ApiError(400, "Validation failed", "VALIDATION_ERROR", result["errors"])
    return result["sanitized"]
