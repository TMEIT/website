from datetime import datetime, timezone

from sqlalchemy import select

from ._email_html_utils import email_header, convert_body_to_html
from ._send_email import send_email
from .. import models
from ..redis import WorkerContext


async def send_password_reset_email(ctx: WorkerContext, email: str, reset_token: str):
    """Sends a password reset token to a specified email"""
    async with ctx['db_session']() as db:
        stmt = select(models.Member).where(models.Member.login_email == email)
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        member: models.Member = result.Member

    full_name = f'{member.first_name} "{member.nickname}" {member.last_name}'

    body = (
        f'Hi {full_name},\n\n'
        'You are receiving this email since a pasword reset has been requested for your tmeit account.\n\n'
        'If you did not make this request, please ignore this message.\n\n'
        'You can reset your password by visiting <a href=\"tmeit.se/reset/{reset_token}\">tmeit.se/reset/{reset_token}</a>\n\n'
        "XOXO\n"
        "A fucking computer\n"
    )
    
    send_email(
        sending_user="tmeit",
        to_display_name=full_name,
        to_email='1@test.com',#to_email=email,
        subject=f"Password reset requested - TMEIT - {datetime.now(timezone.utc)}",
        message_text=body,
        message_html=(email_header + convert_body_to_html(body) + '</body></html>'),
    )
    print('send to 1@test.com')