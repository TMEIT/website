from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

app = FastAPI()


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


# Load index.html from frontend https://stackoverflow.com/a/65917164
@app.get("/")
async def read_index():
    return FileResponse('static/front/index.html')

# Expose js and css from frontend under /static/front
app.mount("/static/front", StaticFiles(directory="static/front"), name="static-front")
