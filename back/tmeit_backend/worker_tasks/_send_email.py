import smtplib
import email
import email.policy
import email.utils
import uuid

POSTFIX_HOSTNAME = "postfix-mail"
POSTFIX_PORT = 587


# This blog explains how to use python email.message.EmailMessage kinda
# https://coderzcolumn.com/tutorials/python/email-how-to-represent-an-email-message-in-python

# This blog is also decent, but they use the legacy Python 3.2 API
# https://russell.ballestrini.net/quickstart-to-dkim-sign-email-with-python/

# It's so confusing D:


def send_email(
    *,
    sending_user: str,
    to_display_name: str = "",
    to_email: str,
    subject: str,
    message_text: str,
    message_html: str,
):
    """
    Builds a MIME email and sends it.

    Builds an RFC5322/RFC6532 compliant email with both plaintext and html bodies.
    The email contains all the headers needed to make SpamAssassin happy.

    The email is then sent to the postfix container to be sent out to the recipient's email server.
    """
    sender_email = f"{sending_user}@tmeit.se"

    message = email.message.EmailMessage(policy=email.policy.SMTP)
    message.make_alternative()

    message.add_header("From", sender_email)
    message.add_header("To", f"{to_display_name} <{to_email}>")
    message.add_header("Subject", subject)
    message.add_header("Date", email.utils.formatdate())
    message.add_header("Message-ID", f"<{uuid.uuid4()}-tmeit-website-backend@tmeit.se>")
    message.add_header("MIME-Version", "1.0")

    # Add bodies to multipart
    message.add_alternative(message_text, subtype="plain")
    message.add_alternative(message_html, subtype="html")

    with smtplib.SMTP(POSTFIX_HOSTNAME, port=POSTFIX_PORT) as s:
        s.send_message(
            msg=message,
            from_addr=sender_email,
            to_addrs=[to_email],
        )
