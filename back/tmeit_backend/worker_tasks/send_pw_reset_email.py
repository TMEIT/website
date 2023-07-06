
async def send_pw_reset_email(ctx: WorkerContext, member_uuid: str, pw_uuid: str, user_email: str):
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
        "We have received a password reset request for the TMEIT account connected to this email address."
        "You can reset your password by following the link below. The link will expire 24 after the request was made.\n\n"
        "<a href="www.tmeit.se/members/reset/{pw_uuid}>Reset password</a>
        "\n\nIf the request was not made by you, please contact webbmarsalk or any of the masters as soon as possible.\n\n"
        "Kind regards,\n\nA fucking computer\n"
    )

    send_email(
        sending_user="TMEIT",
        to_display_name=full_name,
        to_email=user_email,
        subject=f"Password reset request from tmeit.se - {datetime.now(timezone.utc)}",
        message_text=body,
        message_html=(email_header + convert_body_to_html(body) + '</body></html>'),
    }
