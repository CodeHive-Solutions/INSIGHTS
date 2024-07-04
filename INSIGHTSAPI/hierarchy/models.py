"""This file contains the models for the hierarchy app. """
from django.db import models


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100)

    def __str__(self):
        """String representation of the model."""
        return self.name

class JobPosition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rank = models.PositiveIntegerField()

    def __str__(self):
        return self.name
