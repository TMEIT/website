import itertools
import random
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Member

from ..schemas.members.enums import CurrentRoleEnum

from .swedish_men_names import men_names
from .swedish_women_names import women_names
from .swedish_last_names import swedish_last_names

first_names: list[str] = list(itertools.chain(iter(men_names['dimension']['Fornamn']['category']['label'].values()),
                                              iter(women_names['dimension']['Fornamn']['category']['label'].values())))
last_names: list[str] = list(swedish_last_names['dimension']['Efternamn']['category']['label'].values())


def create_member() -> Member:
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return Member(
        uuid=str(uuid4()),
        email=f"{random.randint(10000000, 99999999)}@kth.se",
        current_role=CurrentRoleEnum.master.value,
        first_name=first_name,
        nickname=first_name[:2] + last_name[:2],
        last_name=last_name,
        phone=f"0{random.randint(100000000, 999999999)}",
        drivers_license=bool(random.getrandbits(1)),
        stad=bool(random.getrandbits(1)),
        fest=bool(random.getrandbits(1)),
        liquor_permit=bool(random.getrandbits(1)),
    )


async def create_members(number: int, db: AsyncSession) -> None:
    members: list[Member] = [create_member() for _ in range(number)]

    async with db.begin():
        db.add_all(members)
    await db.commit()
