"""This file contains the models for the SGC app."""
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import logging
import os
import magic


def file_content_validator(value):
    """Validates that the uploaded file is valid."""
    print("something")
    valid_types = [
        "Microsoft Word 2007+",
        "PDF document",
        "Microsoft PowerPoint 2007+",
        "Microsoft Excel 2007+",
        "Microsoft Word 97-2003",
    ]
    if value.size > 10000000:
        raise ValidationError("El archivo no puede pesar mas de 10MB")
    mime = magic.Magic()
    file_type = mime.from_buffer(value.read())  # Read a small portion of the file
    logger = logging.getLogger("requests")
    logger.info("value.size")
    logger.info(file_type)
    value.seek(0)  # Reset the file pointer to the beginning for further use

    if not file_type in valid_types:
        raise ValidationError(
            "Formato de archivo no válido. Se aceptan los siguientes tipos: .docx, .pdf, .pptx, .xlsx, .doc"
        )


class SGCFile(models.Model):
    """Model for the SGC files."""

    name = models.CharField(max_length=200)
    area = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    sub_type = models.CharField(max_length=100)
    version = models.CharField(max_length=100, default="1.0")
    file = models.FileField(
        upload_to="files/SGC/",
        validators=[
            FileExtensionValidator(["xlsx", "pdf", "docx", "doc", "pptx"]),
            file_content_validator,
        ],
    )

    def __str__(self):
        """String representation of the model."""
        return self.name
