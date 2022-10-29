import datetime
import itertools
import random
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from .. import auth
from ..models import Member, SignUp, MemberWebsiteMigration

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


def create_member(hashed_password, email_number) -> Member:
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return Member(
        uuid=str(uuid4()),
        login_email=f"{email_number}@kth.se",
        hashed_password=hashed_password,
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


def create_signup(hashed_password, email_number) -> SignUp:
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)

    # Randomly pick an IPv4 or an IPv6 address
    ip_address = random.choice(["::ffff:8efa:4aae", "2a00:1450:400f:805::200e"])

    return SignUp(
        uuid=str(uuid4()),
        ip_address=ip_address,
        login_email=f"prao{email_number}@kth.se",
        hashed_password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        phone=random.choice([None, f"0{random.randint(100000000, 999999999)}"]),
    )


def create_member_website_migration(email_number) -> SignUp:
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return MemberWebsiteMigration(
        uuid=str(uuid4()),
        security_token="yeet",
        old_username=f"vraq{email_number}",
        current_role=CurrentRoleEnum.master.value,
        login_email=f"vraq{email_number}@kth.se",
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
    hashed_password = auth.ph.hash('yeet')

    members: list[Member] = [create_member(hashed_password, i) for i in range(number)]

    async with db.begin():
        db.add_all(members)
    await db.commit()


async def create_signups(number: int, db: AsyncSession) -> None:
    hashed_password = auth.ph.hash('yeet')

    signups: list[SignUp] = [create_signup(hashed_password, i) for i in range(number)]

    async with db.begin():
        db.add_all(signups)
    await db.commit()


async def create_member_website_migrations(number: int, db: AsyncSession) -> None:

    mwms: list[MemberWebsiteMigration] = [create_member_website_migration(i) for i in range(number)]

    async with db.begin():
        db.add_all(mwms)
    await db.commit()
