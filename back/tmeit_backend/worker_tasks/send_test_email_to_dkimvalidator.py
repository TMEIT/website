from ._send_email import send_email
from ..redis import WorkerContext


async def send_test_email_to_dkimvalidator(ctx: WorkerContext, validator_random_user: str):
    """Sends a test email to DKIMvalidator"""
    send_email(
        sending_user="email_test",
        to_email=f"{validator_random_user}@dkimvalidator.com",
        subject="Is this thing working?",
        message_text="yeet",
        message_html="<h1>yeet</h1>",
    )
