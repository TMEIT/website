import ipaddress
from typing import Union
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ._utils import convert_to_ipv6
from .. import models
from ..auth import ph
from ..schemas.members.schemas import MemberMasterView
from ..schemas.sign_up import SignUp, SignUpForm


async def sign_up(db: AsyncSession, data: SignUpForm, ip_address: Union[ipaddress.IPv4Address, ipaddress.IPv6Address]) -> SignUp:

    uuid = uuid4()
    hashed_password = ph.hash(data.password)
    ip = convert_to_ipv6(ip_address)

    async with db.begin():
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
