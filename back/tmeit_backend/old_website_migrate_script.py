import asyncio
import base64
import datetime
import os
import uuid
import re

from typing import TypedDict, Optional

# STATIC VARS FOR GROUP IDs AND PROP IDs
import asyncmy
from asyncmy.cursors import DictCursor
from pydantic import BaseModel

from .database import get_production_url, get_async_engine, get_async_session
from .models import MemberWebsiteMigration
from .schemas.members.enums import CurrentRoleEnum

WEBSITE_END_DATE = datetime.date(year=2022, month=10, day=26)

# tmeit_users_props ids
PropDatePrao = 1
PropDateMars = 2
PropDateVraq = 3
PropBirthdate = 9
PropOldTitle = 10
PropPasscard = 11
PropFlagStad = 20
PropFlagFest = 21
PropFlagPermit = 22
PropFlagDriversLicense = 23
PropLastDrinkPrefs = 40
PropLastFoodPrefs = 41

GROUP_ID_TRANSLATION = {
    1: CurrentRoleEnum.marshal.value,
    2: CurrentRoleEnum.vraq.value,
    3: CurrentRoleEnum.master.value,
    4: CurrentRoleEnum.prao.value,
    5: CurrentRoleEnum.ex.value,
    7: CurrentRoleEnum.ex.value,  # Inactive role is meaningless and we just convert them to "ex" or "exprao"
    8: "pajas",  # Only klaeng had this role, he became vraq in like 2019, so no one has this role anymore
}


class user_table_row(BaseModel):
    username: str
    realname: str
    phone: str
    email: str
    is_admin: bool
    is_team_admin: bool
    is_hidden: bool
    group_id: Optional[int]
    title_id: Optional[int]
    team_id:  Optional[int]
    mediawiki_user_id: int


def parse_name(realname: str) -> (str, str, str):
    last_name = realname.split(" ")[-1]
    first_name = realname.split(" ")[:-1]
    nickname = None

    # try to derive nickname
    nickname_tokens = re.split(r'\(|\)|"|”', realname)  # split on  " ” ( )  one of those is a unicode quote
    if len(nickname_tokens) not in (1, 3):
        raise ValueError(realname)  # SOMEONE HAS A WEIRD NAME
    elif len(nickname_tokens) == 3:
        nickname = nickname_tokens[1]
        first_name = nickname_tokens[0]

    return first_name, nickname, last_name


async def user_has_prop(cursor: DictCursor, user_id: int, prop_id: int) -> bool:
    await cursor.execute("SELECT count(*) FROM tmeit_users_props WHERE user_id = %s AND prop_id = %s", (user_id, prop_id))
    return (await cursor.fetchone()) > 0


async def migrate_user(user_id: int, pool) -> MemberWebsiteMigration | None:
    async with pool.acquire() as conn:
        async with conn.cursor(cursor=DictCursor) as cursor:
            await cursor.execute("use tmeit")
            await cursor.execute(" SET CHARACTER SET utf8mb4")

            await cursor.execute("SELECT * FROM tmeit_users WHERE id = %s", (user_id,))
            user_table_data = user_table_row(**(await cursor.fetchone()))

            if user_table_data.group_id is None:  # glitched/ deleted user, could be a duplicate, don't import
                return None

            # See if user has a marshal date
            is_prao = not (await user_has_prop(cursor=cursor, user_id=user_id, prop_id=PropDateMars))

            current_role = GROUP_ID_TRANSLATION[user_table_data.group_id]
            if current_role == CurrentRoleEnum.ex.value and is_prao:  # Filter exprao out of ex and inactive groups
                current_role = CurrentRoleEnum.exprao.value

            first_name, nickname, last_name = parse_name(user_table_data.realname)

            drivers_license: bool = await user_has_prop(cursor=cursor, user_id=user_id, prop_id=PropFlagDriversLicense)
            stad: bool = await user_has_prop(cursor=cursor, user_id=user_id, prop_id=PropFlagStad)
            fest: bool = await user_has_prop(cursor=cursor, user_id=user_id, prop_id=PropFlagFest)
            liquor_permit: bool = await user_has_prop(cursor=cursor, user_id=user_id, prop_id=PropFlagPermit)

    return MemberWebsiteMigration(
        uuid=uuid.uuid4(),
        security_token=base64.b64encode(os.urandom(32)), # 256-bit key encoded with base64, generated from urandom
        old_username=user_table_data.username,
        login_email=user_table_data.email,
        current_role=current_role,
        first_name=first_name,
        nickname=nickname,
        last_name=last_name,
        phone=user_table_data.phone,
        drivers_license=drivers_license,
        stad=WEBSITE_END_DATE if stad else None,
        fest=WEBSITE_END_DATE if fest else None,
        liquor_permit=WEBSITE_END_DATE if liquor_permit else None,
    )


async def main():
    # Connect to new db
    db_url = get_production_url()
    engine = get_async_engine(db_url, echo=True)

    # connect to old db
    pool = await asyncmy.create_pool(host='127.0.0.1', port=3306,
                                     user='root', password='',
                                     db='tmeit', charset='utf8')

    # Get list of users in old db
    async with pool.acquire() as conn:
        async with conn.cursor(cursor=DictCursor) as cursor:
            await cursor.execute("SELECT id FROM tmeit_users")
            user_ids: list[int] = [row['id'] for row in await cursor.fetchall()]

    # Build new data from old db
    mwms: list[MemberWebsiteMigration] = await asyncio.gather(*[migrate_user(id, pool) for id in user_ids])

    # Commit new data to new db
    async with get_async_session(engine)() as db:
        async with db.begin():
            db.add_all(mwms)


if __name__ == '__main__':
    asyncio.run(main())
