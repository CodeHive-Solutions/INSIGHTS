"""This module represents the pqrs models. """
from django.db import models


# Create your models here.
class Complaint(models.Model):
    """This class represents the complaint model."""

    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(default="PENDING")
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Congratulation(models.Model):
    """This class represents the congratulation model."""

    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Suggestion(models.Model):
    """This class represents the suggestion model."""

    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(default="PENDING")
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)


class Other(models.Model):
    """This class represents the other model."""

    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        default="PENDING",
    )
    resolution_date = models.DateTimeField(null=True)
    user = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)
