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
    sql_event = dict(result.Event.__dict__)
    return response_schema.parse_obj(sql_event)

async def get_events(db: AsyncSession, response_schema: Type[S], skip: int = 0, limit: int = 1000) -> list[S]:
    stmt = select(models.Event).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_events = [dict(e.__dict__) for e in result.scalars().all()]
    return [response_schema.parse_obj(sql_event) for sql_event in sql_events]

async def delete_event(db: AsyncSession, uuid: UUID) -> None:
    async with db.begin():
        stmt = select(models.Event).where(models.Event.uuid == str(uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        await db.delete(result.Event)