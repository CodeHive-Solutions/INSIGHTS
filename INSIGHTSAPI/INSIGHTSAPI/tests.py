"""This file contains the tests for the Celery app. """

from celery import current_app
from django.test import TestCase
from django.conf import settings
from django.core.mail import get_connection
from django.test import override_settings
from django.core.mail import EmailMessage
from django.urls import reverse
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


class CustomEmailBackendTestCase(TestCase):
    """Test case for the CustomEmailBackend class."""

    @override_settings(
        EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend",
    )
    def test_send_messages(self):
        """Test the send_messages method."""
        # By default in a test environment, the email is not sent
        backend = get_connection()
        email = EmailMessage(
            "Subject here",
            "Here is the message.",
            None,
            [settings.EMAIL_FOR_TEST],
            connection=backend,
        )
        email.send()
        self.assertEqual(len(backend.outbox), 1)

    def test_send_messages_to_wrong_email(self):
        """Test the send_messages method."""
        # By default in a test environment, the email is not sent
        backend = "INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
        try:
            email = EmailMessage(
                "Subject here",
                "Here is the message.",
                None,
                ["not_allowed_email@not_allowed.com"],
                connection=get_connection(backend=backend),
            )
            email.send()
            self.fail("Email should not be sent.")
        except Exception as e:
            self.assertIn("not allowed in test mode", str(e))

    @override_settings(
        ADMINS=[("Heibert Mogollon", settings.EMAIL_FOR_TEST)],
        DEBUG=False,  # Ensure DEBUG is False to enable email sending on errors
        EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend",
    )
    def test_admin_email_on_server_error(self):
        """Test that an email is sent to the admins on a server error."""
        with self.assertRaises(Exception) as context:
            self.client.get(reverse("trigger_error"))

        self.assertIn("Test error", str(context.exception))
