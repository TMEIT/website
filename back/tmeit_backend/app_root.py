from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from starlette.routing import Mount

from . import app_api
from .worker_pool import init_pool
from .routers.health import router as health_router


# This creates the root FastAPI app
# This app routes incoming requests between static frontend files and backend API endpoints

routes = [
    Mount("/api/v1", app_api.app),  # API routes
    Mount("/static/front",  # Expose js and css from React frontend under /static/front
          StaticFiles(directory="static/front"),
          name="static-front"),
]


app = FastAPI(routes=routes,
              on_startup=[init_pool])  # Connect to redis and initialize arq worker pool


# Import healthcheck endpoints
app.include_router(health_router)


# Load SPA from frontend for SPA endpoints https://stackoverflow.com/a/65917164
@app.get("/")
@app.get("/events")
@app.get("/team")
@app.get("/join_tmeit")
@app.get("/profile/{shortguid}")
@app.get("/profile/{shortguid}/{name}")
@app.get("/join_completed")
@app.get("/master")
@app.get("/migrate/{uuid}")
@app.get("/migrate/{uuid}/admin")
@app.get("/migrating")
async def load_js_app():
    return FileResponse('static/front/index.html')


@app.get("/webpack_report")
async def load_report():
    """ A report for showing how big each webpack bundle is """
    return FileResponse('static/front/report.html')


# Redirect invalid pages
@app.get("/profile")
@app.get("/profile/")
async def dont_load_empty_profile():
    return RedirectResponse('/team')

