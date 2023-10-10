"""This file contains the custom user model for the users app."""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


def validate_file_extension(value):
    """Validates that the uploaded file is a .webp image."""
    if not value.name.endswith(".webp"):
        raise ValidationError("Solo puedes subir imágenes .webp ")
    elif value.size > 5000000:
        raise ValidationError("El archivo no puede pesar mas de 5MB")


class User(AbstractUser):
    """Custom user model."""

    profile_picture = models.ImageField(
        upload_to="images/pictures/", validators=[validate_file_extension]
    )
    email = models.EmailField(unique=True, null=True, blank=False, default=None)
    password = None
    date_joined = None
    last_login = None
    is_superuser = None
    is_staff = None

    @property
    def is_active(self):
        """Return all the users like active."""
        return True

    class Meta:
        """Meta class."""
        permissions = [("upload_robinson_list", "Can upload robinson list")]
