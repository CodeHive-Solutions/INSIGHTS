"""This module contains the model for the vacation request """

from django.db import models
from users.models import User
from notifications.utils import create_notification
from django.utils import timezone


class VacationRequest(models.Model):
    """Model for the vacation request"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="vacation_requests"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    request_file = models.FileField(upload_to="vacation_requests/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    manager_approbation = models.BooleanField(null=True, blank=True)
    manager_approved_at = models.DateTimeField(null=True, blank=True)
    hr_approbation = models.BooleanField(null=True, blank=True)
    hr_approved_at = models.DateTimeField(null=True, blank=True)
    payroll_approbation = models.BooleanField(null=True, blank=True)
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
    uploaded_by = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="uploaded_requests"
    )

    class Meta:
        """Meta class for the vacation request model."""

        permissions = [
            ("payroll_approbation", "Can approve payroll"),
        ]

    @property
    def duration(self):
        """Return the duration of the vacation request."""
        return (self.end_date - self.start_date).days

    def __str__(self):
        return f"{self.user} - {self.start_date} - {self.end_date}"

    def save(self, *args, **kwargs):
        """Override the save method to update status and create notifications."""
        approbation_fields = {
            "manager_approbation": "manager_approved_at",
            "hr_approbation": "hr_approved_at",
            "payroll_approbation": "payroll_approved_at",
        }

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
        elif self.status == "RECHAZADA":
            create_notification(
                f"Solicitud de vacaciones rechazada",
                f"Tu solicitud de vacaciones del {self.start_date} al {self.end_date} ha sido rechazada. Haz click aquí para más información.",
                self.user,
            )
        elif self.status == "CANCELADA":
            create_notification(
                f"Solicitud de vacaciones cancelada",
                f"Tu solicitud de vacaciones del {self.start_date} al {self.end_date} ha sido cancelada. Haz click aquí para más información.",
                self.user,
            )
        super().save(*args, **kwargs)
