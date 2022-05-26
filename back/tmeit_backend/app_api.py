import random
import string
from uuid import uuid4

from fastapi import FastAPI, Depends

from sqlalchemy.future import select

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas.members.model import Member, base64url_length_8
from .schemas.members.enums import CurrentRoleEnum

from . import models

from .database import async_session, engine

# Our FastAPI sub-app for the v1 API
app = FastAPI()


async def get_db():
    """DB dependency for FastAPI endpoints. Yields an AsyncSession."""
    async with async_session() as db:
        yield db


async def api_startup():
    # Create tables #TODO replace with alembic
    async with engine.begin() as conn:
        await conn.run_sync(
            models.Base.metadata.create_all
        )


def get_dummy_member(short_guid: base64url_length_8) -> Member:
    return Member(
        guid=uuid4(),
        short_guid=short_guid,
        email="lmao@lol.se",
        first_name="Rofl",
        last_name="Lmao",
        current_role=CurrentRoleEnum.master,
        role_histories=[],
        workteams=[],
        workteams_leading=[],
    )


@app.get("/members/", response_model=list[Member])
async def get_members(db: AsyncSession = Depends(get_db)):
    members = await db.execute(select(models.Member))
    random_short_guid = ''.join(random.choices(string.ascii_letters+string.digits+"-_", k=8))
    return [get_dummy_member(random_short_guid)]


@app.get("/members/{short_guid}", response_model=Member)
def get_member(short_guid: base64url_length_8):
    return get_dummy_member(short_guid)
