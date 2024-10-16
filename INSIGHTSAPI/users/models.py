"""This file contains the custom user model for the users app."""

import logging
import random
from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.mail import mail_admins
from django.db import connections, models

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
    email = models.EmailField(null=True, blank=True)
    company_email = models.EmailField(null=True, blank=True)
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
        null=False,
        blank=False,
        related_name="users",
    )
    points = models.IntegerField(default=0)
    date_joined = None

    @property
    def is_active(self):
        """Return all the users like active."""
        return True

    class Meta:
        """Meta class just create the permission this don't automatically assign to any user."""

        permissions = [
            ("upload_robinson_list", "Can upload robinson list"),
            ("upload_points", "Can upload points"),
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

    def set_last_login(self):
        """Set the last login of the user."""
        self.last_login = datetime.now()
        self.save()

    def save(self, *args, **kwargs):
        """Create a user in the database."""
        if not self.pk:
            if (
                str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}
                or str(self.username).startswith("test_user_")
            ) or self.cedula == "00000000":
                result = [
                    str(random.randint(0, 99999999)),
                    (
                        "Administrador"
                        if str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}
                        else "Test"
                    ),
                    (
                        "Administrador"
                        if str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}
                        else "Test"
                    ),
                ]
                if self.cedula:
                    result[0] = self.cedula
                mails = [settings.EMAIL_FOR_TEST]
            else:
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

                    if not result:
                        raise ValidationError(
                            "Este usuario de windows no esta registrado en StaffNet contacta a tecnología para mas información."
                        )
                    db_connection.execute(
                        "SELECT correo, correo_corporativo FROM personal_information WHERE cedula = %s",
                        [result[0]],
                    )
                    mails = db_connection.fetchone()
            self.cedula = result[0]
            if mails:
                self.email = mails[0]
                self.company_email = mails[1] if len(mails) > 1 else None
            job_title = result[1]
            user = User.objects.filter(cedula=self.cedula).first()
            if user:
                self.pk = user.pk
            job_position = JobPosition.objects.filter(name=job_title).first()
            if not job_position:
                if "gerente jr" in job_title.lower():
                    rank = 5
                elif "gerente" in job_title.lower():
                    rank = 6
                elif "director" in job_title.lower() or "jefe" in job_title.lower():
                    rank = 4
                elif "coordinador" in job_title.lower():
                    rank = 3
                elif str(self.username).upper() in {"ZEUS", "ADMIN", "STAFFNET"}:
                    rank = 9
                else:
                    mail_admins(
                        "Cargo no encontrado",
                        f"El cargo {job_title} no fue encontrado en la base de datos de jerarquía.",
                    )
                    rank = 1
                job_position = JobPosition.objects.create(name=job_title, rank=rank)
            self.job_position_id = job_position.id
            area, _ = Area.objects.get_or_create(name=result[2])
            self.area_id = area.id
            if not self.is_superuser:
                self.set_unusable_password()
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

        # This may be a signal but the Django documentation does not recommend use them
        if self.job_position.rank >= 5 and not self.area.manager:
            self.area.manager = self
            self.area.save()

    def save_factory(self, *args, **kwargs):
        """The most simple save method for the factory."""
        area, _ = Area.objects.get_or_create(name="Factory")
        self.area_id = area.id
        job_position, _ = JobPosition.objects.get_or_create(name="Factory", rank=1)
        self.job_position_id = job_position.id
        super(User, self).save(*args, **kwargs)

    def __str__(self) -> str:
        """Return the string representation of the user."""
        return self.get_full_name()
