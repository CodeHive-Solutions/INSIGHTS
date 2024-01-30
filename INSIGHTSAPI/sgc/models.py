"""This file contains the models for the SGC app."""
import logging
import magic
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


def file_content_validator(value):
    """Validates that the uploaded file is valid."""
    # print("Validating file content")


class SGCArea(models.Model):
    """Model for the SGC areas."""

    short_name = models.CharField(max_length=20)
    name = models.CharField(max_length=200)

    def __str__(self):
        """String representation of the model."""
        return str(self.name)


class SGCFile(models.Model):
    """Model for the SGC files."""

    name = models.CharField(max_length=200)
    area = models.ForeignKey(SGCArea, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    sub_type = models.CharField(max_length=100)
    version = models.CharField(max_length=100, default="1.0")
    file = models.FileField(
        upload_to="files/SGC/",
        validators=[
            FileExtensionValidator(["xlsx", "pdf", "docx", "doc", "pptx"]),
            # file_content_validator,
        ],
    )

    def __str__(self):
        """String representation of the model."""
        return str(self.name)
