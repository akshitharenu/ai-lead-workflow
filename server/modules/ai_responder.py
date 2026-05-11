"""
AI Responder — generates personalized email responses via Claude.
"""
import anthropic
from config.env import settings
from config.logger import logger
from utils.api_error import ApiError

TONE_MAP = {
    "hot": "urgent, personal, excited — they are ready. Offer immediate next step.",
    "warm": "friendly, value-focused — nurture their interest gently.",
    "cold": "helpful, low-pressure, educational — no hard sell.",
}


def _get_client():
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def generate_response_ai(lead: dict, scoring: dict) -> str:
    """
    Generate a personalized email response for a scored lead.
    Returns the raw email body string.
    """
    if settings.USE_MOCK_AI:
        logger.info(f"Using MOCK AI Responder for tier: {scoring['tier']}")
        return f"Hi {lead['name']},\n\nThank you for reaching out from {lead['company']}. We've received your message: \"{lead['message']}\".\n\nOur team has reviewed your request and classified it as a {scoring['tier']} priority. Someone will be in touch with you shortly to discuss next steps.\n\nBest regards,\nThe AI Growth Team (Mock Mode)"

    tone = TONE_MAP.get(scoring.get("tier", "cold"), TONE_MAP["cold"])

    user_prompt = f"""Write a personalized email response for this lead:
Name: {lead['name']}
Company: {lead['company']}
Message: {lead['message']}

Lead Evaluation:
Tier: {scoring['tier']}
Summary: {scoring['summary']}

Tone Instructions: {tone}

Respond with ONLY the email body. No subject line, no placeholders like [Your Name]. Sign off as "The AI Growth Team"."""

    client = _get_client()

    for attempt in range(2):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": user_prompt}],
            )
            email_body = response.content[0].text.strip()

            if email_body:
                logger.info(
                    f"AI Generated response for tier: {scoring['tier']} ({len(email_body)} chars)"
                )
                return email_body

        except Exception as e:
            logger.error(f"AI Responder request failed (attempt {attempt + 1}): {e}")

    raise ApiError(502, "AI response generation unavailable after retries", "AI_UNAVAILABLE")
