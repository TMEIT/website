from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from starlette.routing import Mount

from . import app_api

# This creates the root FastAPI app
# This app routes incoming requests between static frontend files and backend API endpoints
from .app_api import api_startup

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


@app.get("/health")
async def healh_check():
    """Health check endpoint for kubernetes liveness probes"""
    return {"healthy": True}


# Health check endpoint
@app.get("/ready")
async def ready_check():
    """
    ready check endpoint for kubernetes readiness probes

    Possible tests we could do in the future to cover more cases:
    * connect to database
    """
    return {"ready": True}


@app.on_event("startup")
async def root_startup():
    await api_startup()
