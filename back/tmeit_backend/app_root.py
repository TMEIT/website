from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from . import app_api

# Root FastAPI app that routes incoming requests between static frontend files and backend API endpoints
app = FastAPI()

# API routes
app.mount("/api/v1", app_api.app)

# Load SPA from frontend for "/" and "/*" endpoints https://stackoverflow.com/a/65917164
@app.get("/")
@app.get("/{page}")
async def read_index():
    return FileResponse('static/front/index.html')

# Expose js and css from frontend under /static/front
app.mount("/static/front", StaticFiles(directory="static/front"), name="static-front")
