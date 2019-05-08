# auth.errors.py
# Custom errors to use when handling authentication


class InvalidExternalTokenError(RuntimeError):
    """Raised when a user tries to login with a external token that is invalid."""
    pass
