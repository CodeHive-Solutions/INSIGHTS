"""This file contains the custom user model for the users app."""

import logging
import sys
from django.contrib.auth.models import AbstractUser
from django.core.mail import mail_admins
from django.db import connections
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from hierarchy.models import Area, JobPosition

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
    username = models.CharField(max_length=150, null=True, blank=True, unique=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
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
    job_position = models.ForeignKey(
        "hierarchy.JobPosition",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="users",
    )
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
        ]

    def get_full_name(self) -> str:
        """Return the full name of the user."""

        def capitalize_name(name: str) -> str:
            return " ".join(part.capitalize() for part in name.split())

        if self.last_name:
            return (
                f"{capitalize_name(self.first_name)} {capitalize_name(self.last_name)}"
            )
        return capitalize_name(self.first_name)

    def get_full_name_reversed(self) -> str:
        """Return the full name of the user reversed."""

        def capitalize_name(name: str) -> str:
            return " ".join(part.capitalize() for part in name.split())

        if self.last_name:
            return (
                f"{capitalize_name(self.last_name)} {capitalize_name(self.first_name)}"
            )
        return self.first_name

    def save(self, *args, **kwargs):
        """Create a user in the database."""
        if not self.pk or self.cedula != "":
            with connections["staffnet"].cursor() as db_connection:
                if not self.cedula:
                    db_connection.execute(
                        "SELECT cedula, cargo,campana_general FROM employment_information WHERE usuario_windows = %s",
                        [self.username],
                    )
                else:
                    db_connection.execute(
                        "SELECT cedula, cargo,campana_general FROM employment_information WHERE cedula = %s",
                        [self.cedula],
                    )
                result = db_connection.fetchone()
                if (
                    str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}
                    and not self.cedula
                ) or self.cedula == "00000000":
                    result = ("00000000", "Administrador", "Administrador")
                    self.email = settings.EMAIL_FOR_TEST
                elif not result:
                    raise ValidationError(
                        "Este usuario de windows no esta registrado en StaffNet contacta a tecnología para mas información."
                    )
                    # super(User, self).save(*args, **kwargs)
                self.cedula = result[0]
                user = User.objects.filter(cedula=self.cedula).first()
                if user:
                    self.pk = user.pk
                job_position = JobPosition.objects.filter(name=result[1]).first()
                if not job_position:
                    if "gerente jr" in result[1].lower():
                        rank = 5
                    elif "gerente" in result[1].lower():
                        rank = 6
                    elif "director" in result[1].lower() or "jefe" in result[1].lower():
                        rank = 4
                    elif "coordinador" in result[1].lower():
                        rank = 3
                    else:
                        mail_admins(
                            "Cargo no encontrado",
                            f"El cargo {result[1]} no fue encontrado en la base de datos de jerarquía.",
                        )
                        rank = 1
                    job_position = JobPosition.objects.create(name=result[1], rank=rank)
                self.job_position_id = job_position.id
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
                and isinstance(getattr(self, field.attname), str)
            ):
                setattr(self, field.attname, getattr(self, field.attname).upper())
        super(User, self).save(*args, **kwargs)

    def save_factory(self, *args, **kwargs):
        """The most simple save method for the factory."""
        area, _ = Area.objects.get_or_create(name="Factory")
        self.area_id = area.id
        job_position, _ = JobPosition.objects.get_or_create(name="Factory", rank=1)
        self.job_position_id = job_position.id
        super(User, self).save(*args, **kwargs)