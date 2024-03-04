"""This file contains the custom user model for the users app."""

import logging
import os
import sys
from django.contrib.auth.models import AbstractUser
from django.db import connections
from django.db import models
from django.core.exceptions import ValidationError
from hierarchy.models import Area

logger = logging.getLogger("exceptions")


# Pending of squashing this migrations to delete the function
def validate_file_extension(image):
    """Validates that the uploaded file is a .webp image."""
    # if not image.name.endswith(".webp"):
    # raise ValidationError("Solo puedes subir imágenes .webp ")
    # elif image.size > 5000000:
    # raise ValidationError("El archivo no puede pesar mas de 5MB")


class User(AbstractUser):
    """Custom user model."""

    cedula = models.CharField(max_length=20, null=False, blank=False, unique=True)
    # profile_picture = models.ImageField(
    #     upload_to="images/pictures/", validators=[validate_file_extension]
    # )
    # This field cannot be used because RH does not have the company email
    email = models.EmailField(null=True, blank=True)
    # email = None
    area = models.ForeignKey(
        "hierarchy.Area",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="users",
    )
    job_title = models.CharField(max_length=100, null=True, blank=True)
    date_joined = None
    last_login = None

    @property
    def is_active(self):
        """Return all the users like active."""
        return True

    class Meta:
        """Meta class just create the permission this don't automatically assign to any user."""

        permissions = [
            ("upload_robinson_list", "Can upload robinson list"),
            ("send_employment_certification", "Can send employment certification"),
        ]

    def save(self, *args, **kwargs):
        """Create a user in the database."""
        with connections["staffnet"].cursor() as db_connection:
            db_connection.execute(
                "SELECT cedula, cargo,campana_general FROM employment_information WHERE usuario_windows = %s",
                [self.username],
            )
            result = db_connection.fetchone()
            if str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}:
                result = ("00000000", "Administrador", "Administrador")
                self.email = "heibert.mogollon@cyc-bpo.com"
                # self.email = "diegozxz@hotmail.com"
            elif not result:
                raise ValidationError(
                    "Este usuario de windows no esta registrado en StaffNet contacta a tecnología para mas información."
                )
                # super(User, self).save(*args, **kwargs)
            self.cedula = result[0]
            self.job_title = result[1]
            area, _ = Area.objects.get_or_create(name=result[2])
            self.area_id = area.id
            if not self.is_superuser:
                self.set_unusable_password()
            db_connection.execute(
                "SELECT correo,correo_corporativo FROM personal_information WHERE cedula = %s",
                [self.cedula],
            )
            mails = db_connection.fetchone()
            if mails and "test" in sys.argv:
                self.email = mails[1] or mails[0]
            elif mails:
                self.email = mails[0]
        # Iterate through all fields in the model
        for field in self._meta.fields:
            # Check if the field is a CharField or TextField
            if (
                isinstance(field, (models.CharField, models.TextField))
                and field.name != "password"
                and self.__dict__[field.name]
                and type(getattr(self, field.attname)) == str
            ):
                setattr(self, field.attname, getattr(self, field.attname).upper())
        super(User, self).save(*args, **kwargs)


# @receiver(pre_save, sender=User)
# def pre_save_user(sender, instance, **kwargs):
#     print("PRE SAVE")
#     print(sender.__dict__)
#     print()
#     print(instance.__dict__)
#     print()
#     print(kwargs)
