"""Email service."""

import logging
import ssl
import os
import base64
from typing import List
from smtplib import SMTP
from imaplib import IMAP4_SSL
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string


logger = logging.getLogger("requests")


ALLOWED_EMAILS = {
    "mismetas": {"mismetas@cyc-services.com.co": os.environ["C_2023"]},
    "no-reply": {"no-reply@cyc-services.com.co": os.environ["TecPlusLess"]},
}


def send_email(
    subject: str,
    message: str,
    to_emails: List[str],
    sender_user="no-reply",
    from_email=None,
    cc_emails=None,
    bcc_emails=None,
    html_content=True,
    attachments=None,
    reply_to=None,
    return_path=None,
    save_message=True,
    email_owner=None,
    safe_mode=True,
) -> None | Exception:
    """
    Send an email.

    Parameters:
    - sender_user (str): The email for authentication options: 'mismetas', 'no-reply'.
    - subject (str): The subject of the email.
    - message (str): The content of the email.
    - to_emails (Union[str, List[str]]): The recipient(s) of the email.
    - from_email (str): The email sender to show, just put the name it will use the same @ that the sender_user.
    - cc_emails (Union[str, List[str]]): The CC recipient(s) of the email.
    - bcc_emails (Union[str, List[str]]): The BCC recipient(s) of the email.
    - html_content (bool): Whether the content of the email is HTML.
    - attachments (List[str]): The path(s) of the attachment(s).
    - reply_to (Union[str, List[str]]): The reply-to address(es).
    - return_path (str): The return-path address in case of error.
    - save_message (bool): Whether to save a copy of the email to the 'sent' folder.
    - email_owner (str): The name of the owner of the email is showed in some alerts.
    - safe_mode (bool): Whether to send the email in safe mode.

    Returns:
    - None in case of success.
    - Exception in case of error.
    """
    try:
        if sender_user not in ALLOWED_EMAILS:
            raise Exception("Email not allowed")
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
        with open(str(settings.STATIC_ROOT) + "/images/Logo_cyc_text.png", "rb") as f:
            image_data = f.read()
        logo_base64 = base64.b64encode(image_data).decode("utf-8")
        email_content = render_to_string(
            "email_template.html",
            {
                "message": message,
                "title": subject,
                "safe_mode": safe_mode,
                "logo_base64": logo_base64,
            },
        )
        # print(email_content)
        email = EmailMessage(
            subject,
            email_content,
            from_email,
            to_emails,
            cc=cc_emails,
            bcc=bcc_emails,
            reply_to=reply_to,
        )
        if return_path:
            email.extra_headers["Return-Path"] = return_path

        if attachments:
            # This just work for certain objects
            for attachment in attachments:
                file_name, file_data, content_type = attachment
                email.attach(
                    file_name,
                    file_data,
                    content_type,
                )
            # for attachment in attachments:
            # email.attach_file(attachment)

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
        print(e)
        logger.exception("Error sending email: %s", e)
        return e
