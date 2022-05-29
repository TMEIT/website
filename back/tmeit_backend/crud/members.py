from typing import TypeVar, Type
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import models


S = TypeVar('S', bound=BaseModel)


async def get_member(db: AsyncSession, uuid: UUID, response_schema: Type[S]) -> S:
    stmt = select(models.Member).where(models.Member.uuid == uuid)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    sql_member['role_histories'] = []
    sql_member['workteams'] = []
    sql_member['workteams_leading'] = []
    return response_schema.parse_obj(sql_member)


async def get_member_by_short_uuid(db: AsyncSession, short_uuid: str, response_schema: Type[S]) -> S:
    stmt = select(models.Member).where(models.Member.short_uuid == short_uuid)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    sql_member['role_histories'] = []
    sql_member['workteams'] = []
    sql_member['workteams_leading'] = []
    return response_schema.parse_obj(sql_member)


async def get_member_by_email(db: AsyncSession, email: str, response_schema: Type[S]) -> S:
    stmt = select(models.Member).where(models.Member.email == email)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    sql_member['role_histories'] = []
    sql_member['workteams'] = []
    sql_member['workteams_leading'] = []
    return response_schema.parse_obj(sql_member)


async def get_members(db: AsyncSession, response_schema: Type[S], skip: int = 0, limit: int = 100) -> list[S]:
    stmt = select(models.Member).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_members = [dict(e.__dict__) for e in result.scalars().all()]
    for member in sql_members:
        member['role_histories'] = []
        member['workteams'] = []
        member['workteams_leading'] = []
    return [response_schema.parse_obj(sql_member) for sql_member in sql_members]


