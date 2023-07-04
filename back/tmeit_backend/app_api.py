from fastapi import FastAPI

from .routers.members import router as member_router
from .routers.members import me_router as me_router
from .routers.member_website_migration import router as mwm_router
from .routers.version import router as version_router
from .routers.login import router as login_router
from .routers.sign_up import router as sign_up_router
from .routers.test_email import router as test_email_router
from .routers.events import router as event_router

# Our FastAPI sub-app for the v1 API
app = FastAPI()

# Import endpoints defined in routers/
app.include_router(member_router, prefix="/members")
app.include_router(login_router)
app.include_router(me_router)
app.include_router(mwm_router, prefix="/migrations")
app.include_router(version_router)
app.include_router(sign_up_router, prefix="/sign_up")
app.include_router(test_email_router)
app.include_router(event_router, prefix="/events")
