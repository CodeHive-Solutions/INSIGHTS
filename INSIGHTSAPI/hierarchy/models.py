"""This file contains the models for the hierarchy app. """
from django.db import models


class Management(models.Model):
    """Model for the management"""

    name = models.CharField(max_length=100)


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100)

    def __str__(self):
        """String representation of the model."""
        return self.name
