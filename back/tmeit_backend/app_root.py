from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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


# Load SPA from frontend for "/" and "/*" endpoints https://stackoverflow.com/a/65917164
@app.get("/")
@app.get("/{page}")
async def load_js_app(page=None):
    return FileResponse('static/front/index.html')
