from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


# Load SPA from frontend https://stackoverflow.com/a/65917164
@app.get("/")
@app.get("/{page}")
async def read_index():
    return FileResponse('static/front/index.html')

# Expose js and css from frontend under /static/front
app.mount("/static/front", StaticFiles(directory="static/front"), name="static-front")
