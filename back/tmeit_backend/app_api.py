from fastapi import FastAPI

from .routers.members import router as member_router
from .routers.login import router as login_router

# Our FastAPI sub-app for the v1 API
app = FastAPI()

# Import endpoints defined in routers/
app.include_router(member_router, prefix="/members")
app.include_router(login_router)
