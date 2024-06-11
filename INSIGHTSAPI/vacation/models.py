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
    hr_approved = models.BooleanField(null=True, blank=True)
    hr_approved_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        choices=[("PENDING", "PENDING"), ("APPROVED", "APPROVED"), ("REJECTED", "REJECTED"), ("CANCELLED", "CANCELLED")],
        max_length=100, default="PENDING"
    )
    comment = models.TextField(null=True, blank=True)
    uploaded_by = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="uploaded_requests"
    )

    @property
    def duration(self):
        """Return the duration of the vacation request."""
        return (self.end_date - self.start_date).days

    def __str__(self):
        return f"{self.user} - {self.start_date} - {self.end_date}"

    def save(self, *args, **kwargs):
        """Override the save method to create a notification."""
        if self.hr_approved:
            self.hr_approved_at = timezone.now()
            self.status = "APPROVED"
        elif self.hr_approved is False:
            self.status = "REJECTED"
        super().save(*args, **kwargs)
        if self.status != "PENDING":
            create_notification(
                self.user,
                "Solicitud de vacaciones",
                f"Su solicitud de vacaciones del {self.start_date} al {self.end_date} ha sido {self.status.lower()}.",
            )