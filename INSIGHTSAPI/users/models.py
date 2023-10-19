"""This file contains the custom user model for the users app."""
import logging
import os
from django.contrib.auth.models import AbstractUser
from django.db import connections
from django.db import models
from django.db.utils import IntegrityError
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
    # email = models.EmailField(unique=True, null=True, blank=False)
    email = None
    area = models.ForeignKey(
        "hierarchy.Area",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="users",
    )
    job_title = models.CharField(max_length=100, null=True, blank=True)
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

    def save(self, *args, **kwargs):
        db_config = {
            "user": "root",
            "password": os.environ["LEYES"],
            "host": "172.16.0.6",
            "port": "3306",
            "database": "userscyc",
        }
        connection = None
        try:
            connection = mysql.connector.connect(**db_config)
            query = "SELECT id_user FROM users WHERE user_windows = %s"
            cursor = connection.cursor()
            cursor.execute(query, (self.username,))
            result = cursor.fetchone()
            if result:
                self.cedula = result[0]
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
            if not result:
                raise ValidationError(
                    "El usuario no tiene cargo en la base de datos de staffnet"
                )
            self.job_title = result[0]
            try:
                area = Area.objects.get(name=result[1])
            except Area.DoesNotExist:
                try:
                    area = Area(name=result[1])
                    area.save()
                except IntegrityError as e:
                    # Handle integrity error (e.g., duplicate name)
                    print(f"Error creating the area: {e}")
            self.area_id = area.id
        super(User, self).save(*args, **kwargs)
