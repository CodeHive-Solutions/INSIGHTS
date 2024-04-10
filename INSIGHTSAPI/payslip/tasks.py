import pdfkit
import sys
from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


@shared_task
def send_email_with_attachment(
    payslips,
    logo,
    from_email,
):
    i = 0
    for payslip in payslips:
        i += 1
        rendered_template = render_to_string(
            "payslip.html",
            {"payslip": payslip, "logo": logo},
        )
        pdf = pdfkit.from_string(
            rendered_template,
            False,
            options={"dpi": 600, "orientation": "Landscape", "page-size": "Letter"},
        )
        subject = f"Desprendible de nomina para {payslip['title']}"
        message = "Adjunto se encuentra el desprendible de nomina, en caso de tener alguna duda, por favor comunicarse con el departamento de recursos humanos."
        if "test" in sys.argv or settings.DEBUG:
            payslip["email"] = settings.EMAIL_TEST
        email = EmailMessage(subject, message, from_email, [payslip["email"]])
        attachment = ((f"{payslip['title']}.pdf", pdf, "application/pdf"),)
        email.attachments = attachment
        email.send()
    return True
