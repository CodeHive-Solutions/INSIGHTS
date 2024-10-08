from django.db import models


class Complaint(models.Model):
    reason = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return f"{self.reason}"
