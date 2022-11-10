from datetime import datetime, timezone

from sqlalchemy import select

from ._email_header import email_header
from ._send_email import send_email
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

    def convert_body_to_html(plain_body: str) -> str:
        """Replaces double-linebreaks with <p> tags, and single-linebreaks with <br />"""
        output = ""
        for line in plain_body.split("\n\n"):
            line_with_br = line.replace("\n", "<br />")
            output += f"<p>{line_with_br}</p>"
        return output

    send_email(
        sending_user="email_test",
        to_display_name=full_name,
        to_email=member.login_email,
        subject=f"Email test from tmeit.se - {datetime.now(timezone.utc)}",
        message_text=body,
        message_html=(email_header + convert_body_to_html(body) + '</body></html>'),
    )
