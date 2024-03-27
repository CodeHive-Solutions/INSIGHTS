from django.test import TestCase
from celery import current_app

from INSIGHTSAPI.tasks import add_numbers


class CeleryTestCase(TestCase):
    # Check if celery is able to reach the broker
    def test_celery_is_running(self):
        self.assertIsNotNone(current_app)
        self.assertTrue(current_app.connection())

    # Check if the task is able to be executed
    def test_add_numbers_task(self):
        result = add_numbers.delay(3, 4)
        self.assertTrue(result)

        task_result = result.get(timeout=5)
        self.assertEqual(task_result, 7)
