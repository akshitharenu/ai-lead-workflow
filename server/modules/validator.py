"""
Validator Module — validates and sanitizes incoming lead data.
"""
import re
import html


def validate(data: dict) -> dict:
    """
    Validate lead data. Returns { valid: bool, errors: list[str], sanitized: dict }.
    """
    errors = []

    name = _clean(data.get("name", ""))
    email = _clean(data.get("email", ""))
    company = _clean(data.get("company", ""))
    role = _clean(data.get("role", ""))
    message = _clean(data.get("message", ""))

    # Name
    if not name:
        errors.append("Name is required")
    elif len(name) < 2 or len(name) > 100:
        errors.append("Name must be between 2 and 100 characters")
    elif not re.match(r"^[a-zA-Z\s\-]+$", name):
        errors.append("Name contains invalid characters")

    # Email
    if not email:
        errors.append("Email is required")
    elif not re.match(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$", email):
        errors.append("Invalid email format")

    # Company
    if not company:
        errors.append("Company is required")
    elif len(company) < 2 or len(company) > 200:
        errors.append("Company must be between 2 and 200 characters")

    # Role
    if role and len(role) > 100:
        errors.append("Role must not exceed 100 characters")

    # Message
    if message and len(message) > 5000:
        errors.append("Message must not exceed 5000 characters")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "sanitized": {
            "name": _strip_html(name),
            "email": email.lower(),
            "company": _strip_html(company),
            "role": _strip_html(role),
            "message": _strip_html(message),
        },
    }


def _clean(value: str) -> str:
    """Trim whitespace."""
    if not isinstance(value, str):
        return ""
    return value.strip()


def _strip_html(value: str) -> str:
    """Strip all HTML tags from a string."""
    clean = re.sub(r"<[^>]+>", "", value)
    return html.unescape(clean).strip()
