from typing import Literal, Any

from pydantic import BaseModel


class NotFoundResponse(BaseModel):
    error: str


class ForbiddenResponse(BaseModel):
    error: str


class BadPatchResponse(BaseModel):
    error: Literal["Invalid fields, or you don't have permission to edit these fields."]
    detail: dict[str, Any]
