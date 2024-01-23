"""This file contains the models for the vacancy app."""
from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from PIL import Image
from io import BytesIO


def file_content_validator(value):
    """Validates that the uploaded file is valid."""
    # Just allow webp
    if value.size > 10000000:
        raise ValidationError("El archivo no puede pesar mas de 10MB")
    print(value)
    try:
        img = Image.open(BytesIO(value.read()))
        img.verify()
        if img.format != "WEBP":
            # convert to webp
            img = img.convert("RGB")
            img.save(value, "WEBP")
    except:
        raise ValidationError("Imagen no válida o corrupta.")


class Vacancy(models.Model):
    """This class represents a vacancy."""

    name = models.CharField(max_length=100)
    image = models.ImageField(
        upload_to="vacancy_images/",
        validators=[
            FileExtensionValidator(["webp"]),
            file_content_validator,
        ],
    )

    def __str__(self):
        """This method returns a string representation of the vacancy."""
        return str(self.name)


class Reference(models.Model):
    """This class represents a reference."""

    made_by = models.CharField(max_length=100)
    refer_to = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    phone = models.CharField(max_length=100)
    vacancy = models.CharField(max_length=100)
