"""Models for the quality_notes app."""

from django.db import models

from users.models import User

class QualityNote(models.Model):
    """Quality note model."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.DateField()
    qualification = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.title
