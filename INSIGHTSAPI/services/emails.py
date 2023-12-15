"""Email service."""

import logging
from typing import List, Union
from django.core.mail import EmailMessage


logger = logging.getLogger(__name__)


ALLOWED_EMAILS = {
    "mismetas": {"mismetas@cyc-services.com.co": os.environ["C_2023"]},
}


def send_email(
    subject: str,
    message: str,
    to_emails: Union[str, List[str]],
    sender_user: str,
    html_content=False,
    cc_emails=None,
    bcc_emails=None,
    headers=None,
    attachments=None,
    reply_to=None,
) -> None | Exception:
    """
    Send an email.

    Parameters:
    - subject (str): The subject of the email.
    - message (str): The content of the email.
    - to_emails (Union[str, List[str]]): The recipient(s) of the email.
    - sender_user (str): The username for authentication.
    - sender_password (str): The password for authentication.

    Returns:
    - None in case of success.
    - Exception in case of error.
    """
    try:
        if sender_user not in ALLOWED_EMAILS:
            raise Exception("Email not allowed")
        else:
            sender_email = ALLOWED_EMAILS[sender_user].keys()[0]
            sender_password = ALLOWED_EMAILS[sender_user][sender_email]

        email = EmailMessage(
            subject,
            message,
            to_emails,
            cc=cc_emails,
            bcc=bcc_emails,
            headers=headers,
            reply_to=reply_to,
        )

        email.connection(username=sender_email, password=sender_password)

        if html_content:
            email.content_subtype = "html"

        if attachments:
            for attachment in attachments:
                email.attach(*attachment)

        email.send(fail_silently=False)
        return None
    except Exception as e:
        logger.critical("Error sending email: %s", e)
        return e
