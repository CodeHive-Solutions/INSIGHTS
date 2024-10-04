from django.apps import AppConfig
from django.db.utils import OperationalError


class CoexistenceCommitteeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "coexistence_committee"

    def ready(self):
        self.create_default_groups()

    def create_default_groups(self):
        # Import the models here to ensure the app registry is fully loaded
        from django.contrib.auth.models import Group

        try:

            # Check if the group exists before creating it
            Group.objects.get_or_create(name="coexistence_committee")

        except OperationalError:
            # Handle cases where the database isn't ready yet
            pass

    def create_default_reasons(self):
        from coexistence_committee.models import Reason
        from hierarchy.models import JobPosition

        hr_manager = JobPosition.objects.get(name="Gerente de Recursos Humanos")
        sst = JobPosition.objects.get(name="Técnico de Seguridad y Salud en el Trabajo")
        # Reason.objects.get_or_create(reason="Otro", attendant=None)
