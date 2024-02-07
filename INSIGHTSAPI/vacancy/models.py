"""This file contains the models for the vacancy app."""

from io import BytesIO
from PIL import Image
from django.db import models
from django.core.exceptions import ValidationError


class Vacancy(models.Model):
    """This class represents a vacancy."""

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="vacancy_images/")
    active = models.BooleanField(default=True)

    def __str__(self):
        """This method returns a string representation of the vacancy."""
        return str(self.name)


class Reference(models.Model):
    """This class represents a reference."""

    made_by = models.ForeignKey(
        "users.User", related_name="references", on_delete=models.DO_NOTHING
    )
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    vacancy = models.ForeignKey(
        Vacancy, related_name="references", on_delete=models.DO_NOTHING
    )

    def __str__(self):
        """This method returns a string representation of the reference."""
        return str(self.name)
