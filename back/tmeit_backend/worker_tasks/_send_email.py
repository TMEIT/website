import smtplib
import email
import email.policy
import email.utils

POSTFIX_HOSTNAME = "postfix"
POSTFIX_PORT = 587


# This blog explains how to use python email.message.EmailMessage well
# https://coderzcolumn.com/tutorials/python/email-how-to-represent-an-email-message-in-python

# This blog is also decent, but they use the legacy Python 3.2 API
# https://russell.ballestrini.net/quickstart-to-dkim-sign-email-with-python/

# It's so confusing D:


def send_email(
    sending_user: str,
    to_email: str,  # TODO, how does real name work here?
    subject: str,
    message_text: str,
    message_html: str,
):
    sender_email = f"{sending_user}@tmeit.se"

    message = email.message.EmailMessage(policy=email.policy.SMTP)

    message.add_header("From", sender_email)
    message.add_header("To", to_email)
    message.add_header("Subject", subject)
    message.add_header("Date", email.utils.formatdate())
    message.set_content(message_text, subtype="plain")
    message.set_content(message_html, subtype="html")

    with smtplib.SMTP(POSTFIX_HOSTNAME, port=POSTFIX_PORT) as s:
        s.send_message(
            msg=message,
            from_addr=sender_email,
            to_addrs=[to_email],
        )
