"""Email service."""

import logging
from typing import List, Union
import os
from django.core.mail import EmailMessage


logger = logging.getLogger("requests")


ALLOWED_EMAILS = {
    "mismetas": {"mismetas@cyc-services.com.co": os.environ["C_2023"]},
}


def send_email(
    sender_user: str,
    subject: str,
    message: str,
    to_emails: Union[str, List[str]],
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
    - sender_user (str): The username for authentication.
    - subject (str): The subject of the email.
    - message (str): The content of the email.
    - to_emails (Union[str, List[str]]): The recipient(s) of the email.

    Returns:
    - None in case of success.
    - Exception in case of error.
    """
    try:
        if sender_user not in ALLOWED_EMAILS:
            raise Exception("Email not allowed")
        else:
            sender_email = list(ALLOWED_EMAILS[sender_user].keys())[0]
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

        email.send()

        if html_content:
            email.content_subtype = "html"

        if attachments:
            for attachment in attachments:
                email.attach(*attachment)

        email.send(fail_silently=False)
        return None
    except Exception as e:
        logger.exception("Error sending email: %s", e)
        return e
