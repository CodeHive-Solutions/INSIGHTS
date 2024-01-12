"""This file contains the custom user model for the users app."""
import logging
import os
from django.contrib.auth.models import AbstractUser
from django.db import connections
from django.db import models
from django.core.exceptions import ValidationError
import mysql.connector
from hierarchy.models import Area

logger = logging.getLogger("exceptions")


def validate_file_extension(image):
    """Validates that the uploaded file is a .webp image."""
    if not image.name.endswith(".webp"):
        raise ValidationError("Solo puedes subir imágenes .webp ")
    elif image.size > 5000000:
        raise ValidationError("El archivo no puede pesar mas de 5MB")


class User(AbstractUser):
    """Custom user model."""

    cedula = models.IntegerField(null=False, blank=False, unique=True)
    profile_picture = models.ImageField(
        upload_to="images/pictures/", validators=[validate_file_extension]
    )
    # This field cannot be used because RH does not have the company email
    email = models.EmailField(null=True, blank=True, unique=True)
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

        permissions = [("upload_robinson_list", "Can upload robinson list")]

    def save(self, *args, **kwargs):
        """Create a user in the database."""
        db_config = {
            "user": "root",
            "password": os.environ["LEYES"],
            "host": "172.16.0.6",
            "port": "3306",
            "database": "userscyc",
        }
        connection = None
        # Remove the email field because RH does not have the company email
        try:
            # I have to connect to the intranet database to get the cedula because in StaffNet there is no windows user
            connection = mysql.connector.connect(**db_config)
            query = "SELECT id_user FROM users WHERE user_windows = %s"
            cursor = connection.cursor()
            cursor.execute(query, (self.username,))
            result = cursor.fetchone()
            if result:
                self.cedula = result[0]
            elif self.username == "Zeus":
                self.cedula = 123456789
            else:
                raise ValidationError(
                    "El usuario no tiene cedula en la base de datos de la intranet"
                )
        except Exception as error:
            logger.exception(error)
            raise error
        finally:
            if connection:
                connection.close()
        with connections["staffnet"].cursor() as db_connection:
            db_connection.execute(
                "SELECT cargo,campana_general FROM employment_information WHERE cedula = %s",
                [self.cedula],
            )
            result = db_connection.fetchone()
            if self.cedula == 999999999 or self.cedula == 123456789:
                result = ("Administrador", "Administrador")
            elif not result:
                raise ValidationError(
                    "El usuario no tiene cargo en la base de datos de staffnet"
                )
            if not "asesor" in result[0].lower():
                self.is_staff = True
            self.job_title = result[0]
            area, _ = Area.objects.get_or_create(name=result[1])
            self.area_id = area.id
        # if not self.is_superuser:
        # self.set_unusable_password()
        # Iterate through all fields in the model
        for field in self._meta.fields:
            # Check if the field is a CharField or TextField
            if (
                isinstance(field, (models.CharField, models.TextField))
                and field.name != "password"
                and self.__dict__[field.name]
            ):
                setattr(self, field.attname, getattr(self, field.attname).upper())
        super(User, self).save(*args, **kwargs)
