"""This file contains the models for the hierarchy app. """

from django.db import models
from django.core.mail import mail_admins
from django.contrib.auth import get_user_model


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100, unique=True)
    manager = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, related_name="managed_areas"
    )

    def __str__(self):
        """String representation of the model."""
        return self.name


class JobPosition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rank = models.PositiveIntegerField()

    def __str__(self):
        return self.name
