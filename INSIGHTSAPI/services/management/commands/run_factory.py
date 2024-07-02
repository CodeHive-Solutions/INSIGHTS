# generate_mock_data.py
from django.core.management.base import BaseCommand
from users.factories import UserFactory
from vacation.factories import VacationFactory

FACTORIES = {
    'user': UserFactory,
    'vacation': VacationFactory,
    # Add other model factories here
}

class Command(BaseCommand):
    help = 'Generate mock data using factories'

    def add_arguments(self, parser):
        parser.add_argument(
            'model',
            type=str,
            nargs='?',
            help='The model name to generate data for. If not provided, all factories will be run.'
        )

        parser.add_argument(
            '--count',
            type=int,
            default=1,
            help='The number of instances to create for each factory.'
        )

    def handle(self, *args, **options):
        model = options['model']
        count = options['count']

        if model:
            if model in FACTORIES:
                self.stdout.write(f'Generating {count} instances of {model}...')
                FACTORIES[model].create_batch(count)
                self.stdout.write(self.style.SUCCESS(f'Successfully created {count} instances of {model}.'))
            else:
                self.stdout.write(self.style.ERROR(f'Factory for model "{model}" not found.'))
        else:
            for model_name, factory in FACTORIES.items():
                self.stdout.write(f'Generating {count} instances of {model_name}...')
                factory.create_batch(count)
                self.stdout.write(self.style.SUCCESS(f'Successfully created {count} instances of {model_name}.'))
