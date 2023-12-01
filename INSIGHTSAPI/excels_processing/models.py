"""This file contains the models for the excels_processing app."""
from django.db import models

class ExcelsModels(models.Model):
    """This class contains the models for the excels_processing app."""
    class Meta:
        """Meta class for the ExcelsModels model."""
        managed = False  # No database table creation
        permissions = (
            ("call_transfer", "Can change the path of the calls to the another location"),
        )
