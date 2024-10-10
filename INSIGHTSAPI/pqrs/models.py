"""This module represents the pqrs models. """

from django.core.exceptions import ValidationError
from django.db import models


def validate_max_length_2000(value):
    """Validate the max length of the description field."""
    if len(value) > 2000:
        raise ValidationError("The maximum length is 2000 characters.")


class Management(models.Model):
    """This class represents the management model."""

    # Can't use ForeignKey because the Area model need be refactored in the migration to StaffNet
    area = models.CharField(max_length=50)
    attendant = models.ForeignKey("users.User", on_delete=models.PROTECT)

    def __str__(self):
        """Return the string representation of the model."""
        return self.area


class PQRS(models.Model):
    """This class represents the PQRS model."""

    management = models.ForeignKey(Management, on_delete=models.PROTECT)
    reason = models.CharField(max_length=50)
    description = models.TextField(validators=[validate_max_length_2000])
    created_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey("users.User", on_delete=models.PROTECT)

    def __str__(self):
        """Return the string representation of the model."""
        return f"{self.reason} - {self.user}"
