from fastapi import FastAPI

# Our FastAPI sub-app for the v1 API
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}
