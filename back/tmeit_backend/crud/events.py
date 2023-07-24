import datetime

from typing import TypeVar, Type
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import models
from ..models.events import Event
from ..schemas.events import EventMemberCreate, EventMemberView, EventMemberPatch

S = TypeVar('S', bound=BaseModel)

async def create_event(db: AsyncSession, data: EventMemberCreate) -> EventMemberView:
    uuid = uuid4()
    async with db.begin():
        db.add_all([
            Event(uuid=str(uuid), **data.dict()),
        ])
    return await get_event(db=db, uuid=uuid, response_schema=EventMemberView)

async def get_event(db: AsyncSession, uuid: UUID, response_schema: Type[S]) -> S:
    stmt = select(models.Event).where(models.Event.uuid == str(uuid))
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    return response_schema.parse_obj(sql_member)

async def get_event_by_short_uuid(db: AsyncSession, short_uuid: str, response_schema: Type[S]) -> S:
    stmt = select(models.Event).where(models.Event.short_uuid == short_uuid)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    return response_schema.parse_obj(sql_member)