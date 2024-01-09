# scheduler/management/commands/run_scheduler.py
import time
from django.core.management.base import BaseCommand
from contracts.models import Contract
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = "Run scheduled tasks"

    def handle(self, *args, **options):
        # Check if there are any contracts that need to be renewed
        contracts = Contract.objects.filter(
            renovation_date__lte=timezone.now() + timedelta(days=30)
        )
        for contract in contracts:
            print(contract.name)
            print("Contract '{}' needs to be renewed".format(contract.name))
