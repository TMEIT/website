from typing import TypeVar, Type
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import models
from ..auth import ph, verify_password
from ..models import Member
from ..schemas.members.schemas import MemberAuthentication, MemberMasterCreate, MemberMasterView, MemberMasterPatch, \
    MemberSelfPatch, ChangePassword

S = TypeVar('S', bound=BaseModel)


async def create_member(db: AsyncSession, data: MemberMasterCreate) -> MemberMasterView:
    uuid = uuid4()
    async with db.begin():
        db.add_all([
            Member(uuid=str(uuid), **data.dict()),
        ])
    return await get_member(db=db, uuid=uuid, response_schema=MemberMasterView)


async def get_member(db: AsyncSession, uuid: UUID, response_schema: Type[S]) -> S:
    stmt = select(models.Member).where(models.Member.uuid == str(uuid))
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


async def get_member_by_login_email(db: AsyncSession, login_email: str, response_schema: Type[S]) -> S:
    stmt = select(models.Member).where(models.Member.login_email == login_email)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_member = dict(result.Member.__dict__)
    sql_member['role_histories'] = []
    sql_member['workteams'] = []
    sql_member['workteams_leading'] = []
    return response_schema.parse_obj(sql_member)


async def get_password_hash(db: AsyncSession, login_email: str) -> MemberAuthentication:
    stmt = select(models.Member).where(models.Member.login_email == login_email)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    return MemberAuthentication(login_email=result.Member.login_email,
                                hashed_password=result.Member.hashed_password)


async def change_password(db: AsyncSession, uuid: UUID, data: ChangePassword) -> None:
    async with db.begin():
        stmt = select(models.Member).where(models.Member.uuid == str(uuid))  # Using the UUID to prevent collisions for security
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        member = result.Member
        verify_password(pw=data.current_password, pw_hash=member.hashed_password)
        member.hashed_password = ph.hash(data.new_password)


async def get_members(db: AsyncSession, response_schema: Type[S], skip: int = 0, limit: int = 1000) -> list[S]:
    stmt = select(models.Member).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_members = [dict(e.__dict__) for e in result.scalars().all()]
    for member in sql_members:
        member['role_histories'] = []
        member['workteams'] = []
        member['workteams_leading'] = []
    return [response_schema.parse_obj(sql_member) for sql_member in sql_members]


async def update_member(db: AsyncSession,
                        short_uuid: str,
                        patch_data: MemberSelfPatch | MemberMasterPatch,
                        response_schema: Type[S]) -> S:
    async with db.begin():
        result = (await db.execute(
            update(models.Member)
            .where(models.Member.short_uuid == short_uuid)
            .values(**patch_data.dict())
            .returning('*')
        )).fetchone()

        if result is None:
            raise KeyError()

    sql_member = result._asdict()
    sql_member['role_histories'] = []
    sql_member['workteams'] = []
    sql_member['workteams_leading'] = []

    return response_schema.parse_obj(sql_member)
