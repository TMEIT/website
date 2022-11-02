from sqlalchemy import select

from .. import models
from ..redis import WorkerContext


async def send_test_email(ctx: WorkerContext, member_uuid: str):
    """Sends a test email to a given member, as specified by the member's UUID"""
    async with ctx['db_session']() as db:
        stmt = select(models.Member).where(models.Member.uuid == str(member_uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        member: models.Member = result.Member
    print(member.login_email)
