"""
Robust JSON extraction from AI text responses.
"""
import json
import re


def parse_json_safe(text: str) -> dict | None:
    """
    Attempt to parse JSON from a string.
    Falls back to regex extraction if direct parse fails.
    """
    # Direct parse
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass

    # Extract JSON block from markdown or surrounding text
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    return None
