import datetime
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


def random_date(start_date: datetime.date, stop_date: datetime.date) -> datetime.date:
    interval = stop_date - start_date
    num_days = round(interval / datetime.timedelta(days=1))
    delta = datetime.timedelta(days=random.randint(0, num_days))
    return start_date + delta


def create_member() -> Member:
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return Member(
        uuid=str(uuid4()),
        login_email=f"{random.randint(10000000, 99999999)}@kth.se",
        current_role=CurrentRoleEnum.master.value,
        first_name=first_name,
        nickname=random.choice([None, (first_name[:2] + last_name[:2])]),
        last_name=last_name,
        phone=random.choice([None, f"0{random.randint(100000000, 999999999)}"]),
        drivers_license=random.choice([True, False, None]),
        stad=random.choice([None, random_date(datetime.date(year=2005, month=1, day=1), datetime.date.today())]),
        fest=random.choice([None, random_date(datetime.date(year=2005, month=1, day=1), datetime.date.today())]),
        liquor_permit=random.choice([None, random_date(datetime.date(year=2005, month=1, day=1), datetime.date.today())]),
    )


async def create_members(number: int, db: AsyncSession) -> None:
    members: list[Member] = [create_member() for _ in range(number)]

    async with db.begin():
        db.add_all(members)
    await db.commit()