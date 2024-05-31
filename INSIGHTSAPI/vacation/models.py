"""This module contains the model for the vacation request """

from django.db import models
from users.models import User


class VacationRequest(models.Model):
    """Model for the vacation request"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="vacation_requests"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    request_file = models.FileField(upload_to="vacation_requests/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="uploaded_requests"
    )

    def __str__(self):
        return f"{self.user} - {self.start_date} - {self.end_date}"
