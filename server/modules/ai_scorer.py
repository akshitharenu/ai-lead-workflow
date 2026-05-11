"""
AI Scorer — uses Anthropic Claude to score and classify leads.
"""
import anthropic
from config.env import settings
from config.logger import logger
from utils.parse_json_safe import parse_json_safe
from utils.api_error import ApiError

SYSTEM_PROMPT = (
    "You are a B2B lead qualification AI. Your job is to score incoming sales leads "
    "with precision and consistency. Always respond with valid JSON only."
)


def _get_client():
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def score_lead_ai(lead: dict, enrichment: dict) -> dict:
    """
    Score a lead using Claude. Returns { score, tier, intent, summary, reasoning }.
    Retries once on parse failure.
    """
    if settings.USE_MOCK_AI:
        logger.info("Using MOCK AI Scorer")
        import random
        score = random.randint(3, 9)
        tier = "hot" if score >= 8 else "warm" if score >= 5 else "cold"
        return {
            "score": score,
            "tier": tier,
            "intent": random.choice(["purchase", "demo", "info", "partnership"]),
            "summary": f"Mock summary for {lead['name']} from {lead['company']}.",
            "reasoning": "Mock AI logic used for testing without an API key."
        }

    user_prompt = f"""Score this incoming lead:
Name: {lead['name']}
Company: {lead['company']}
Role: {lead.get('role', 'N/A')}
Message: {lead['message']}

Returning Contact: {'Yes' if enrichment['isReturning'] else 'No'}
Prior Interactions: {enrichment['leadCount']}

Return ONLY a JSON object with these fields:
{{
  "score": (integer 1-10),
  "tier": ("hot"|"warm"|"cold"),
  "intent": (short string describing intent, e.g. "purchase", "demo", "info"),
  "summary": (1-sentence summary of the lead),
  "reasoning": (brief explanation of the score)
}}"""

    client = _get_client()

    for attempt in range(2):
        try:
            response = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=512,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            text = response.content[0].text
            result = parse_json_safe(text)

            if result:
                logger.info(f"AI Scored lead: {result.get('score')}/10, Tier: {result.get('tier')}")
                return result

            if attempt == 0:
                logger.warning("AI Scorer JSON parse failed, retrying...")

        except Exception as e:
            logger.error(f"AI Scorer request failed (attempt {attempt + 1}): {e}")

    raise ApiError(502, "AI scoring unavailable after retries", "AI_UNAVAILABLE")
