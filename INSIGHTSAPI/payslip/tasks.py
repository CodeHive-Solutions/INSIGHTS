import pdfkit
from celery import shared_task
from django.core.mail import EmailMessage


@shared_task
def send_email_with_attachment(
    payslip_title, rendered_template, subject, message, from_email, recipient_list
):
    pdf = pdfkit.from_string(
        rendered_template,
        False,
        options={"dpi": 600, "orientation": "Landscape", "page-size": "Letter"},
    )
    email = EmailMessage(subject, message, from_email, recipient_list)
    attachment = ((f"{payslip_title}.pdf", pdf, "application/pdf"),)
    email.attachments = attachment
    email.send()
