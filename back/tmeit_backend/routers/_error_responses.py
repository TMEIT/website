from pydantic import BaseModel


class NotFoundResponse(BaseModel):
    error: str


class ForbiddenResponse(BaseModel):
    error: str
