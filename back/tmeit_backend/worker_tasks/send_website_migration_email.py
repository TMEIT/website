from datetime import datetime, timezone, timedelta

from sqlalchemy import select

from ._email_html_utils import email_header
from ._send_email import send_email
from .. import models
from ..redis import WorkerContext
from ..schemas.members.enums import CurrentRoleEnum


async def send_website_migration_email(ctx: WorkerContext, mwm_uuid: str):
    """Sends an email to a migrating member so that they can finish their migration to the new website."""

    async with ctx['db_session']() as db:
        stmt = select(models.MemberWebsiteMigration).where(models.MemberWebsiteMigration.uuid == str(mwm_uuid))
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        mwm: models.MemberWebsiteMigration = result.MemberWebsiteMigration

    if mwm.email_sent is not None \
            and (mwm.email_sent > (datetime.now(tz=timezone.utc) - timedelta(seconds=10))):
        print("Last email was sent less than 10 seconds ago! Job may have been run twice by ARQ. Aborting.")
        return

    if mwm.nickname is not None:
        full_name = f'{mwm.first_name} "{mwm.nickname}" {mwm.last_name}'
    else:
        full_name = f'{mwm.first_name} {mwm.last_name}'

    migration_confirmation_url = f"https://tmeit.se/migrate/{mwm.uuid}?token={mwm.security_token}"

    feature_brag = ""
    if mwm.current_role in (CurrentRoleEnum.marshal.value, CurrentRoleEnum.prao.value, CurrentRoleEnum.master ):
        feature_brag = ("I hope that the new website will be a nice performance and aesthetics upgrade! "
                        "We will be re-implementing the workteams and events systems soon.")
    else:
        feature_brag = ("For former members and Vraq, I hope that the new website makes it easier for you to "
                        "see what TMEIT is up to and catch up with old friends! "
                        "We are planning on adding yearbook pages for every year, "
                        "all the way back to 2004 when TMEIT was founded, so look out for that! "
                        "The old wiki pages will return to the website soon, too!")

    body = (
        f'The new tmeit.se has been released!!\n\n'
        
        f'Hi {full_name},\n\n'
        
        "The 1.0 of the new tmeit.se is finally here!\n\n"
        
        "We are migrating all of the accounts from the old mediawiki website, "
        "and we are asking all TMEIT members to activate their accounts and set a new password.\n\n"
        
        "Please go to your account migration page, linked below, to activate your account on the new tmeit.se!\n"
        f"{migration_confirmation_url}\n"
        "(Please note that this email is going out before the website is live. "
        "The link above will become active at 2022-11-11 18:00 CET.)\n\n"
        
        "Please email Lex if you have any questions at mail@jlh.name.\n"
        "Also, let me know if there were any mistakes importing your data.\n\n"
        
        f"{feature_brag}\n\n"
        
        "Enjoy the new website, and hype for the RÖJVECKA celebrations for TMEIT's 18th birthday in two weeks!\n\n"
        "-- Justin Lex-Hammarskjöld, Webb(ex)Marskalk for TMEIT"
    )

    html_body = (
        f"{email_header}"
        f'<h1>The new tmeit.se has been released!!</h1>'
        
        f'<p>Hi {full_name},</p>'
        
        '<p>The 1.0 of the new <a href="https://tmeit.se" style="color: #dddddd;">tmeit.se</a> is finally here!</p>'
        
        '<p style="text-align: center;">We are migrating all of the accounts from the old mediawiki website, '
        "and we are asking all TMEIT members to activate their accounts and set a new password.</p>"
        
        '<p style="text-align: center;">Please go to your account migration page, linked below, to activate your account on the new tmeit.se!<br />'
        f'<a href="{migration_confirmation_url}" style="color: #dddddd;">{migration_confirmation_url}</a><br />'
        "(Please note that this email is going out before the website is live. "
        "The link above will become active at 2022-11-11 18:00 CET.)</p>"
        
        '<p style="text-align: center;">Please email Lex if you have any questions at '
        '<a href="mailto:mail@jlh.name" style="color: #dddddd;">mail@jlh.name</a>.<br />'
        "Also, let me know if there were any mistakes importing your data.</p>"
        
        f'<p style="text-align: center;">{feature_brag}</p>'
        
        "<p>Enjoy the new website, and hype for the RÖJVECKA celebrations for TMEIT's 18th birthday in two weeks!</p>"
        "<p><i>-- Justin Lex-Hammarskjöld, Webb(ex)Marskalk for TMEIT</i></p>"
        '</body></html>'
    )

    send_email(
        sending_user="account_migration",
        to_display_name=full_name,
        to_email=mwm.login_email,
        subject=f"The new tmeit.se is here! - Please migrate your account",
        message_text=body,
        message_html=html_body,
    )

    # Update email sent column

    # FIXME: breaks pydantic validation on mwm schema??
    # async with ctx['db_session']() as db:
    #     async with db.begin():
    #         stmt = select(models.MemberWebsiteMigration).where(models.MemberWebsiteMigration.uuid == str(mwm_uuid))
    #         result = (await db.execute(stmt)).fetchone()
    #         if result is None:
    #             raise KeyError()
    #         mwm: models.MemberWebsiteMigration = result.MemberWebsiteMigration
    #         mwm.email_sent = datetime.now(tz=timezone.utc)
