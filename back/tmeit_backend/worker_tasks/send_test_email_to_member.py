from datetime import datetime, timezone

from sqlalchemy import select

from ._send_email import send_email
from ._tmeit_logo import tmeit_logo
from .. import models
from ..redis import WorkerContext


async def send_test_email_to_member(ctx: WorkerContext, member_uuid: str):
    """Sends a test email to a given member, as specified by the member's UUID"""

    async with ctx['db_session']() as db:
        stmt = select(models.Member).where(models.Member.uuid == str(member_uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        member: models.Member = result.Member

    full_name = f'{member.first_name} "{member.nickname}" {member.last_name}'

    body = (
        f'Hi {full_name},\n\n'
        "This is a test to see if you are receiving emails from the tmeit.se server.\n\n"
        "If you can see this message, that means that the tmeit.se email system is working!\n\n"
        "HAAAAJP\n\n"
        "XOXO,\n"
        "A fucking computer\n"
    )

    send_email(
        sending_user="email_test",
        to_display_name=full_name,
        to_email=member.login_email,
        subject=f"Email test from tmeit.se - {datetime.now(timezone.utc)}",
        message_text=body,
        message_html=(
            '<!DOCTYPE html>'
            '<html lang="en">'
            '<head>'
                '<meta charset="UTF-8">'
            '</head>'
            '<body>'
            f'<img src={tmeit_logo} style="width: 50%;" alt="TMEIT logo"/>'
        ) + body + (
            '</body>'
            '</html>'
        ),
    )
