"""This module contains the model for the vacation request """

import pdfkit
from django.conf import settings
from django.core.mail import EmailMessage, send_mail
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone

from notifications.utils import create_notification
from users.models import User
from vacation.utils import get_return_date


class VacationRequest(models.Model):
    """Model for the vacation request"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="vacation_requests"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    sat_is_working = models.BooleanField(default=True)
    request_file = models.FileField(upload_to="files/vacation_requests/")
    boss_is_approved = models.BooleanField(null=True, blank=True)
    boss_approved_at = models.DateTimeField(null=True, blank=True)
    manager_is_approved = models.BooleanField(null=True, blank=True)
    manager_approved_at = models.DateTimeField(null=True, blank=True)
    hr_is_approved = models.BooleanField(null=True, blank=True)
    hr_approved_at = models.DateTimeField(null=True, blank=True)
    payroll_is_approved = models.BooleanField(null=True, blank=True)
    payroll_approved_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        choices=[
            ("PENDIENTE", "PENDIENTE"),
            ("APROBADA", "APROBADA"),
            ("RECHAZADA", "RECHAZADA"),
            ("CANCELADA", "CANCELADA"),
        ],
        max_length=100,
        default="PENDIENTE",
    )
    comment = models.TextField(null=True, blank=True)
    # this column is deprecated, but needs to be kept for backwards compatibility
    uploaded_by = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="uploaded_requests"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """Meta class for the vacation request model."""

        permissions = [
            ("payroll_approval", "Can approve payroll"),
        ]

    @property
    def duration(self):
        """Return the duration of the vacation request."""
        return (self.end_date - self.start_date).days

    @property
    def return_date(self):
        """Return the return date of the vacation request."""
        return get_return_date(self.end_date, self.sat_is_working)

    def __str__(self):
        return f"{self.user} - {self.start_date} - {self.end_date}"

    def save(self, *args, **kwargs):
        """Override the save method to update status and create notifications."""
        approbation_fields = {
            "boss_is_approved": "boss_approved_at",
            "manager_is_approved": "manager_approved_at",
            "hr_is_approved": "hr_approved_at",
            "payroll_is_approved": "payroll_approved_at",
        }

        # Set the time of approval
        for field, approved_at in approbation_fields.items():
            approbation = getattr(self, field)
            if approbation is not None:
                if not approbation:
                    self.status = "RECHAZADA"
                setattr(self, approved_at, timezone.now())

        if all(getattr(self, field) for field in approbation_fields):
            self.status = "APROBADA"
        if self.status == "APROBADA":
            create_notification(
                f"Solicitud de vacaciones aprobada",
                f"Tus vacaciones del {self.start_date} al {self.end_date} han sido aprobadas. Esperamos que las disfrutes ⛱!.",
                self.user,
            )
            self.send_approval_email_with_pdf()
        elif self.status == "RECHAZADA":
            message = f"""
                Hola {self.user.get_full_name()} 👋,

                Lamentamos informarte que tu solicitud de vacaciones del {self.start_date.strftime("%d de %B del %Y")} al {self.end_date.strftime("%d de %B del %Y")} ha sido rechazada.

                Nos vimos en la necesidad de tomar esta decisión debido a: {self.comment}.

                Habla con tu gerente o con el departamento de Recursos Humanos si tienes alguna pregunta o necesitas más información. Recuerda que puedes volver a enviar tu solicitud en otro momento.

                Saludos cordiales,
                """
            send_mail(
                "Estado de tu solicitud de vacaciones",
                message,
                None,
                [str(self.user.email)],
            )
            create_notification(
                f"Solicitud de vacaciones rechazada",
                f"Tu solicitud de vacaciones del {self.start_date} al {self.end_date} ha sido rechazada.",
                self.user,
            )
        elif self.status == "CANCELADA":
            message = f"""
                Hola {self.user.get_full_name()} 👋,

                Has cancelado tu solicitud de vacaciones del {self.start_date.strftime("%d de %B del %Y")} al {self.end_date.strftime("%d de %B del %Y")}.

                Saludos cordiales,
                """
            send_mail(
                "Solicitud de cancelación de vacaciones",
                message,
                None,
                [str(self.user.email)],
            )
            create_notification(
                f"Solicitud de vacaciones cancelada",
                f"Tu solicitud de vacaciones del {self.start_date} al {self.end_date} ha sido cancelada.",
                self.user,
            )
        super().save(*args, **kwargs)

    def send_approval_email_with_pdf(self):
        # Render the vacation request details in a PDF
        pdf = self.generate_pdf()

        # Create the email message
        subject = "Solicitud de vacaciones aprobada"
        message = (
            f"Hola {self.user.get_full_name()} 👋,\n\n"
            "Nos complace informarte que tu solicitud de vacaciones ha sido aprobada.\n\n"
            f"Por favor revisa el archivo adjunto para más detalles sobre tus vacaciones del {self.start_date.strftime('%d de %B del %Y')} al {self.end_date.strftime('%d de %B del %Y')}.\n\n"
            "¡Esperamos que disfrutes tus vacaciones! 🏖️\n\n"
        )

        email = EmailMessage(
            subject, message, settings.DEFAULT_FROM_EMAIL, [str(self.user.email)]
        )

        # Attach the generated PDF
        email.attach(
            filename="Solicitud de vacaciones.pdf",
            content=pdf,
            mimetype="application/pdf",
        )

        # Send the email
        email.send()

    def generate_pdf(self):
        # Create context for the PDF
        context = {
            "vacation": self,
        }

        # Render the HTML template to a string
        rendered_html = render_to_string("vacation_response.html", context)

        # PDF options
        options = {
            "page-size": "Letter",
            "orientation": "Portrait",
            "encoding": "UTF-8",
            "margin-top": "0mm",
            "margin-right": "0mm",
            "margin-bottom": "0mm",
            "margin-left": "0mm",
        }

        # Generate the PDF from HTML
        pdf = pdfkit.from_string(rendered_html, False, options=options)

        return pdf
