from typing import Literal

from fastapi import FastAPI, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from pydantic import BaseModel
from starlette.routing import Mount

from . import app_api

# This creates the root FastAPI app
# This app routes incoming requests between static frontend files and backend API endpoints

routes = [
    Mount("/api/v1", app_api.app),  # API routes
    Mount("/static/front",  # Expose js and css from React frontend under /static/front
          StaticFiles(directory="static/front"),
          name="static-front"),
]


app = FastAPI(routes=routes)


# Load SPA from frontend for SPA endpoints https://stackoverflow.com/a/65917164
@app.get("/")
@app.get("/events")
@app.get("/team")
@app.get("/join_tmeit")
@app.get("/profile/{shortguid}")
@app.get("/profile/{shortguid}/{name}")
async def load_js_app():
    return FileResponse('static/front/index.html')


# Redirect invalid pages
@app.get("/profile")
@app.get("/profile/")
async def dont_load_empty_profile():
    return RedirectResponse('/team')


class HealthyResponse(BaseModel):
    healthy: Literal[True]


@app.get("/health", response_model=HealthyResponse)
async def healh_check():
    """Health check endpoint for kubernetes liveness probes"""
    return {"healthy": True}


class ReadyResponse(BaseModel):
    ready: Literal[True]


class NotReadyResponse(BaseModel):
    ready: Literal[False]
    error: str


# Health check endpoint
@app.get("/ready", response_model=ReadyResponse, responses={503: {"model": NotReadyResponse}})
async def ready_check(db=Depends(app_api.get_db)):
    """
    Ready check endpoint for kubernetes readiness probes

    Returns 200 when db is up
    """
    try:
        await db.execute("SELECT 1")
    except Exception:
        JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                     content={"ready": False, "error": "Cannot connect to database"})
    else:
        return {"ready": True}
