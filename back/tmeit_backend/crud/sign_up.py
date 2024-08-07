import ipaddress
from typing import Union
from uuid import UUID, uuid4

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .members import get_member
from .. import models
from ..auth import ph
from ..schemas.members.enums import CurrentRoleEnum
from ..schemas.members.schemas import MemberMasterView, MemberMasterCreate
from ..schemas.sign_up import SignUp, SignUpForm


async def sign_up(db: AsyncSession, data: SignUpForm,
                  ip_address: Union[ipaddress.IPv4Address, ipaddress.IPv6Address]) -> SignUp:
    async with db.begin():
        # Make sure no members or signups exist with the same email
        email = data.login_email
        dupe_signups = await db.execute(select(func.count(models.SignUp.uuid)).where(models.SignUp.login_email == email))
        dupe_members = await db.execute(select(func.count(models.Member.uuid)).where(models.Member.login_email == email))
        if dupe_signups.scalar() > 0:
            raise ValueError(f"A signup already exists with the {email=}.")
            # TODO: Ideally we would tell them: "Have you already signed up? Check your email!"
        if dupe_members.scalar() > 0:
            raise ValueError(f"A member already exists with the {email=}.")

        # Compute uuid, hash, and ip address
        uuid = uuid4()
        hashed_password = ph.hash(data.password)
        match ip_address:
            case ipaddress.IPv6Address():
                ip = str(ip_address)
            case ipaddress.IPv4Address():  # Convert IPv4 address to an IPv4-Mapped IPv6 Address
                ip_bytes = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff' + ip_address.packed
                ip = str(ipaddress.IPv6Address(ip_bytes))
            case _:
                raise ValueError("Invalid IP address!")

        # Add new row
        db.add_all([
            models.SignUp(uuid=str(uuid),
                          login_email=data.login_email,
                          hashed_password=hashed_password,
                          ip_address=ip,
                          first_name=data.first_name,
                          last_name=data.last_name,
                          phone=data.phone),
        ])

    return await get_sign_up(db=db, uuid=uuid)


async def get_sign_ups(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[SignUp]:
    stmt = select(models.SignUp).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_signups = [dict(e.__dict__) for e in result.scalars().all()]
    return [SignUp.parse_obj(sql_signup) for sql_signup in sql_signups]


async def get_sign_up(db: AsyncSession, uuid: UUID) -> SignUp:
    stmt = select(models.SignUp).where(models.SignUp.uuid == str(uuid))
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_signup = dict(result.SignUp.__dict__)
    return SignUp.parse_obj(sql_signup)


async def approve_sign_up(db: AsyncSession, uuid: UUID) -> MemberMasterView:
    async with db.begin():
        stmt = select(models.SignUp).where(models.SignUp.uuid == str(uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        sql_signup: models.SignUp = result.SignUp

        uuid = uuid4()
        db.add_all([
            models.Member(uuid=str(uuid),
                          login_email=sql_signup.login_email,
                          current_role=CurrentRoleEnum.prao.value,
                          hashed_password=sql_signup.hashed_password,
                          first_name=sql_signup.first_name,
                          last_name=sql_signup.last_name),
            # TODO: We should also add a RoleHistory here with the prao signup date
        ])
        await db.delete(sql_signup)

    return await get_member(db=db, uuid=uuid, response_schema=MemberMasterView)


async def delete_sign_up(db: AsyncSession, uuid: UUID) -> None:
    async with db.begin():
        stmt = select(models.SignUp).where(models.SignUp.uuid == str(uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        await db.delete(result.SignUp)
