"""This file contains the code to run the scheduler """

import logging
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.core.mail import send_mail, mail_admins
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from contracts.models import Contract

logger = logging.getLogger("requests")


class Command(BaseCommand):
    """Class to run the scheduler"""

    help = "Run scheduled tasks"

    def add_arguments(self, parser):
        parser.add_argument("--production", nargs=1, type=str)

    def handle(self, *args, **options):
        if (
            "production" in options
            and options["production"]
            and options["production"][0] == "True"
        ):
            to_email = ["DIEGO.GONZALEZ@CYC-BPO.COM", "MELIDA.SANDOVAL@CYC-BPO.COM"]
        else:
            to_email = [settings.EMAIL_FOR_TEST]
        target_date_30 = timezone.now() + timedelta(days=30)
        target_date_15 = timezone.now() + timedelta(days=15)
        target_date_7 = timezone.now() + timedelta(days=7)
        contracts = Contract.objects.filter(
            Q(renovation_date=target_date_30)
            | Q(renovation_date=target_date_15)
            | Q(renovation_date=target_date_7)
            | Q(renovation_date=timezone.now())
        )
        if contracts.count() == 0:
            self.stdout.write("No contracts to renew")
        for contract in contracts:
            days_left = (contract.renovation_date - timezone.now().date()).days
            if days_left == 0:
                message = (
                    f"Hoy es el ultimo dia para renovar el contrato '{contract.name}'"
                )
            else:
                message = f"""
                El contrato '{contract.name}' necesita ser renovado, terminará en {days_left} días,
                este contrato es el encargado de {contract.description} para renovarlo asegúrate de ponerte en 
                contacto con {contract.contact} mediante {contract.contact_telephone} recuerda que la fecha
                de renovación es el {contract.renovation_date}"""
            try:
                send_mail(
                    f"{contract.name} necesita ser renovado",
                    message,
                    None,
                    to_email,
                )
                self.stdout.write(
                    self.style.WARNING(
                        f"Email sent for contract {contract.name} to {to_email}"
                    )
                )
            except Exception as e:
                logger.error(
                    "Error enviando correo para el contrato %s: %s", contract.name, e
                )
                mail_admins(
                    f"Error enviando correo para el contrato {contract.name}",
                    f"Error enviando correo para el contrato {contract.name}",
                )
