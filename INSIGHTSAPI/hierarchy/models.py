"""This file contains the models for the hierarchy app. """

from django.db import models


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100, unique=True)
    parent = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, related_name="children"
    )
    manager = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, related_name="managed_areas"
    )

    class Meta:
        permissions = [
            ("manage_area", "Can manage the area"),
        ]

    def __str__(self) -> str:
        """String representation of the model."""
        return self.name


class JobPosition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rank = models.PositiveIntegerField()

    def __str__(self) -> str:
        return self.name
