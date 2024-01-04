"""This module represents the pqrs models. """
from django.db import models
from django.core.exceptions import ValidationError


def validate_max_length_1000(value):
    """Validate the max length of the description field."""
    if len(value) > 2000:
        raise ValidationError("The maximum length is 2000 characters.")


# Create your models here.
class Complaint(models.Model):
    """This class represents the complaint model."""

    area = models.CharField(max_length=60)
    description = models.TextField(validators=[validate_max_length_1000])
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, default="PENDING")
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Congratulation(models.Model):
    """This class represents the congratulation model."""

    area = models.CharField(max_length=60)
    description = models.TextField(validators=[validate_max_length_1000])
    created_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Suggestion(models.Model):
    """This class represents the suggestion model."""

    area = models.CharField(max_length=60)
    description = models.TextField(validators=[validate_max_length_1000])
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, default="PENDING")
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Other(models.Model):
    """This class represents the other model."""

    area = models.CharField(max_length=60)
    description = models.TextField(validators=[validate_max_length_1000])
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, default="PENDING")
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)
