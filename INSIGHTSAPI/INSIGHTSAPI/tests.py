"""This file contains the tests for the Celery app. """

from django.test import TestCase
from celery import current_app

from INSIGHTSAPI.tasks import add_numbers


class CeleryTestCase(TestCase):
    """Test case for the Celery app."""

    # Check if celery is able to reach the broker
    def test_celery_is_running(self):
        """Test if the Celery communicate with Redis."""
        self.assertIsNotNone(current_app)
        self.assertTrue(current_app.connection)

    # Check if the task is able to be executed
    def test_add_numbers_task(self):
        """Test if the tasks are working."""
        result = add_numbers.delay(3, 4)
        self.assertTrue(result)

        task_result = result.get(timeout=5)
        self.assertEqual(task_result, 7)
