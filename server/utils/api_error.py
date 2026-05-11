"""
Custom API Error class with factory methods.
"""


class ApiError(Exception):
    def __init__(self, status_code: int, message: str, code: str = "INTERNAL_ERROR", details=None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.code = code
        self.details = details

    @classmethod
    def validation(cls, message="Validation Error", details=None):
        return cls(400, message, "VALIDATION_ERROR", details)

    @classmethod
    def not_found(cls, message="Resource Not Found"):
        return cls(404, message, "NOT_FOUND")

    @classmethod
    def ai_unavailable(cls, message="AI Service Unavailable"):
        return cls(502, message, "AI_UNAVAILABLE")

    @classmethod
    def internal(cls, message="Internal Server Error"):
        return cls(500, message, "INTERNAL_ERROR")
