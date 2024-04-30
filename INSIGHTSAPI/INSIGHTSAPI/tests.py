"""This file contains the tests for the Celery app. """

from django.test import TestCase
from celery import current_app
from django.core.mail import get_connection
from INSIGHTSAPI.tasks import add_numbers
from django.core.mail import EmailMessage


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

class CustomEmailBackendTestCase(TestCase):
    """Test case for the CustomEmailBackend class."""

    def test_send_messages(self):
        """Test the send_messages method."""
        backend = "INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
        # Create an EmailMessage instance using your custom backend
        try:
            email = EmailMessage(
                "Subject here",
                "Here is the message.",
                None,
                ["not_allowed_email@not_allowed.com"],
                connection=get_connection(backend=backend)
            )
            email.send()
            self.fail("Email should not be sent.")
        except Exception as e:
            self.assertIn("not allowed in test mode", str(e))
