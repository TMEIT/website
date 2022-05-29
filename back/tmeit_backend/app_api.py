from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas.members.schemas import base64url_length_8, MemberViewResponse, MemberMasterView, MemberMemberView

from . import database
from .crud.members import get_members, get_member_by_short_uuid


# Our FastAPI sub-app for the v1 API
app = FastAPI()

# Create SQLAlchemy engine and db connection pool to be shared across requests.
# Requires that POSTGRES_PASSWORD envvar is set.
db_url = database.get_production_url()
engine = database.get_async_engine(db_url)
async_session = database.get_async_session(engine)


async def get_db():
    """DB dependency for FastAPI endpoints. Yields an AsyncSession."""
    async with async_session() as db:
        yield db


@app.get("/members/")  # TODO: investigate output validation
async def read_members(db: AsyncSession = Depends(get_db)):
    return await get_members(db=db, response_schema=MemberMemberView)


@app.get("/members/{short_uuid}")  # TODO: investigate output validation
async def read_member(short_uuid: base64url_length_8, db: AsyncSession = Depends(get_db)):
    try:
        member = await get_member_by_short_uuid(db=db, short_uuid=short_uuid, response_schema=MemberMemberView)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member with the {short_uuid=} was found."})
    return member
