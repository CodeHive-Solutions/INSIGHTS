# emails.py

from django.core.mail import EmailMessage

def send_plain_text_email(subject, message, from_email, to_emails, cc_emails=None, bcc_emails=None, headers=None, attachments=None):
    email = EmailMessage(
        subject,
        message,
        from_email,
        to_emails,
        cc=cc_emails,
        bcc=bcc_emails,
        headers=headers,
    )

    if attachments:
        for attachment in attachments:
            email.attach(*attachment)

    email.send(fail_silently=False)

def send_html_email(subject, html_content, from_email, to_emails, cc_emails=None, bcc_emails=None, headers=None, attachments=None):
    email = EmailMessage(
        subject,
        html_content,
        from_email,
        to_emails,
        cc=cc_emails,
        bcc=bcc_emails,
        headers=headers,
    )
    email.content_subtype = "html"  # Set the content type to HTML

    if attachments:
        for attachment in attachments:
            email.attach(*attachment)

    email.send(fail_silently=False)
