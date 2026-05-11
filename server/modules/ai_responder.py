"""
AI Responder — generates personalized email responses via Claude.
"""
import anthropic
import google.generativeai as genai
from config.env import settings
from config.logger import logger
from utils.api_error import ApiError

TONE_MAP = {
    "hot": "urgent, personal, excited — they are ready. Offer immediate next step.",
    "warm": "friendly, value-focused — nurture their interest gently.",
    "cold": "helpful, low-pressure, educational — no hard sell.",
}


def _generate_with_anthropic(prompt: str) -> str:
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()


def _generate_with_gemini(prompt: str) -> str:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()


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

    # Determine which engine to use
    use_claude = bool(settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY.strip())
    use_gemini = bool(settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY.strip())

    for attempt in range(2):
        try:
            if use_claude:
                logger.info("Engine: Anthropic Claude")
                return _generate_with_anthropic(user_prompt)
            elif use_gemini:
                logger.info("Engine: Google Gemini")
                return _generate_with_gemini(user_prompt)
            else:
                logger.warning("No AI API keys found! Using fallback response.")
                return "Thank you for your interest! We will get back to you soon."

        except Exception as e:
            logger.error(f"AI Responder request failed (attempt {attempt + 1}): {e}")
            if attempt == 1:
                logger.warning("All AI attempts failed. Using fallback response.")
                return "Thank you for your interest! Our team will review your lead and get back to you shortly."

    raise ApiError(502, "AI response generation unavailable after retries", "AI_UNAVAILABLE")
