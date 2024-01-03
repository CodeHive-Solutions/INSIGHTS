"""Email service."""

import logging
from typing import List, Union
from smtplib import SMTP
import ssl
import os
from imaplib import IMAP4_SSL
from django.core.mail import EmailMessage
from django.conf import settings


logger = logging.getLogger("requests")


ALLOWED_EMAILS = {
    "mismetas": {"mismetas@cyc-services.com.co": os.environ["C_2023"]},
    "no-reply": {"no-reply@cyc-services.com.co": os.environ["TecPlusLess"]},
}


def send_email(
    sender_user: str,
    subject: str,
    message: str,
    to_emails: List[str],
    from_email=None,
    cc_emails=None,
    bcc_emails=None,
    html_content=False,
    attachments=None,
    reply_to=None,
    return_path=None,
    save_message=True,
    email_owner=None,
) -> None | Exception:
    """
    Send an email.

    Parameters:
    - sender_user (str): The email for authentication.
    - subject (str): The subject of the email.
    - message (str): The content of the email.
    - to_emails (Union[str, List[str]]): The recipient(s) of the email.
    - from_email (str): The sender of the email just put the name it will use the same @ that the sender_user.
    - cc_emails (Union[str, List[str]]): The CC recipient(s) of the email.
    - bcc_emails (Union[str, List[str]]): The BCC recipient(s) of the email.
    - html_content (bool): Whether the content of the email is HTML.
    - attachments (List[str]): The path(s) of the attachment(s).
    - reply_to (Union[str, List[str]]): The reply-to address(es).
    - return_path (str): The return-path address in case of error.
    - save_message (bool): Whether to save a copy of the email to the 'sent' folder.
    - email_owner (str): The email name showed.

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
        smtp_connection = SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        smtp_connection.ehlo()
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        smtp_connection.starttls(context=context)
        smtp_connection.login(sender_email, sender_password)
        from_email_domain = sender_email.split("@")[1]
        if from_email:
            from_email = f"{from_email}@{from_email_domain}"
        else:
            from_email = sender_email
        if email_owner:
            from_email = f"{email_owner} <{from_email}>"
        email = EmailMessage(
            subject,
            message,
            from_email,
            to_emails,
            cc=cc_emails,
            bcc=bcc_emails,
            attachments=attachments,
            reply_to=reply_to,
        )
        if return_path:
            email.extra_headers["Return-Path"] = return_path

        if html_content:
            email.content_subtype = "html"

        # Get the underlying EmailMessage object
        email_msg = email.message()
        result = smtp_connection.send_message(email_msg)
        if result:
            return Exception("Error sending email")
        if save_message:
            with IMAP4_SSL(settings.EMAIL_HOST) as imap_connection:
                imap_connection.login(sender_email, sender_password)
                imap_connection.select('"sent"', readonly=False)

                # Save a copy of the email to the 'sent' folder
                result, _ = imap_connection.append(
                    '"sent"', None, None, email_msg.as_bytes()
                )
                if result != "OK":
                    logger.exception("Error saving email to 'sent' folder: %s", result)
                    return Exception("Error saving email to 'sent' folder")
        return None
    except Exception as e:
        logger.exception("Error sending email: %s", e)
        return e
