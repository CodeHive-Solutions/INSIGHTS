"""This file contains the models for the hierarchy app. """

from django.db import models
from users.models import User
from django.db.models import Q
from django.core.mail import mail_admins


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100)
    # manager = models.ForeignKey(
    #     "User", on_delete=models.SET_NULL, null=True, related_name="managed_areas"
    # )

    def __str__(self):
        """String representation of the model."""
        return self.name

    # def save(self, *args, **kwargs):
    #     """Save method for the model."""
    #     if not self.manager:
    #         self.manager = (
    #             User.objects.filter(area__name=self.name, job_position__rank__gte=5)
    #             .order_by("job_position__rank")
    #             .first()
    #         )
    #         if not self.manager:
    #             mail_admins(
    #                 "Warning",
    #                 f"No manager found for area {self.name}. Please assign a manager.",
    #             )
    #     super(Area, self).save(*args, **kwargs)


class JobPosition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rank = models.PositiveIntegerField()

    def __str__(self):
        return self.name
