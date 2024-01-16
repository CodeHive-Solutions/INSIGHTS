"""This file contains the code to run the scheduler """
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
from contracts.models import Contract
from services.emails import send_email
import logging

logger = logging.getLogger("requests")


class Command(BaseCommand):
    """Class to run the scheduler"""

    logger.error("Error in scheduler")

    help = "Run scheduled tasks"

    def add_arguments(self, parser):
        parser.add_argument("--production", nargs=1, type=str)

    def handle(self, *args, **options):
        if (
            "production" in options
            and options["production"]
            and options["production"][0] == "True"
        ):
            # to_email = ["DIEGO.GONZALEZ@CYC-BPO.COM"]
            to_email = ["heibert.mogollon1@cyc-bpo.com"]
        else:
            to_email = ["heibert.mogollon@cyc-bpo.com"]
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
                message = f"""El contrato '{contract.name}' necesita ser renovado, terminará en {days_left} días, 
                este contrato es el encargado de {contract.description} para renovarlo asegurate de ponerte en 
                contacto con {contract.contact} mediante {contract.contact_telephone} recuerda que la fecha
                de renovación es el {contract.renovation_date}"""
            send_email(
                "no-reply",
                f"{contract.name} necesita ser renovado",
                message,
                to_email,
                cc_emails=[
                    "juan.carreno@cyc-bpo.com",
                    "heibert.mogollon@cyc-bpo.com",
                ],
                save_message=True,
                email_owner="Contratos C&C",
            )
            self.stdout.write(
                self.style.WARNING(
                    f"Email sent for contract {contract.name} to {to_email}"
                )
            )
