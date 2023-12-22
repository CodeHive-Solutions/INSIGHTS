"""This file contains the models for the SGC app."""
from django.db import models
from django.core.exceptions import ValidationError
import os


def validate_file_extension(value):
    """Validates that the uploaded file is valid."""
    valid_extensions = [".xlsx", ".pdf", ".docx", ".doc", ".pptx"]
    path = os.path.splitext(value.name)[1]  # [0] returns path+filename
    if not path.lower() in valid_extensions:
        raise ValidationError(
            "Formato de archivo no valido, solo se aceptan archivos .xlsx, .pdf, .docx, .doc, .pptx"
        )
    elif value.size > 10000000:
        raise ValidationError("El archivo no puede pesar mas de 10MB")


class SGCFile(models.Model):
    """Model for the SGC files."""

    name = models.CharField(max_length=100)
    area = models.ForeignKey("hierarchy.area", on_delete=models.DO_NOTHING)
    type = models.CharField(max_length=100)
    sub_type = models.CharField(max_length=100)
    file = models.FileField(
        upload_to="files/SGC/", validators=[validate_file_extension]
    )
