import datetime

from typing import TypeVar, Type
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import models
from ..models import Event
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

async def get_event_by_timespan(db: AsyncSession, start_time: datetime, end_time: datetime, response_schema: Type[S]) -> S:
    stmt = select(models.Event)
    .filter(models.Event.event_time.between(start_time, end_time))
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    return response_schema.parse_obj(sql_member)

async def update_event(db: AsyncSession,
                        short_uuid: str,
                        patch_data: EventMemberPatch,
                        response_schema: Type[S]) -> S:
    async with db.begin():
        await db.execute(
            update(models.Event)
            .where(models.Member.short_uuid == short_uuid)
            .values(patch_data.dict())
        )

        result = (await db.execute(
            select(models.Event)
            .where(models.Event.short_uuid == short_uuid)
        )).fetchone()

        if result is None:
            raise KeyError()

    sql_member = dict(result.Member.__dict__)
    return response_schema.parse_obj(sql_member)
    
