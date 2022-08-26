from typing import Literal

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from ._database_deps import get_db


router = APIRouter()


class HealthyResponse(BaseModel):
    healthy: Literal[True]


@router.get("/health", response_model=HealthyResponse)
async def health_check():
    """Health check endpoint for kubernetes liveness probes"""
    return {"healthy": True}


class ReadyResponse(BaseModel):
    ready: Literal[True]


class NotReadyResponse(BaseModel):
    ready: Literal[False]
    error: str


# Health check endpoint
@router.get("/ready", response_model=ReadyResponse, responses={503: {"model": NotReadyResponse}})
async def ready_check(db=Depends(get_db)):
    """
    Ready check endpoint for kubernetes readiness probes

    Returns 200 when db is up
    """
    try:
        await db.execute("SELECT 1")
    except Exception:
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            content={"ready": False, "error": "Cannot connect to database"})
    else:
        return {"ready": True}
