"""This file contains the tests for the Celery app. """

from celery import current_app
from django.conf import settings
from django.core.mail import EmailMessage, get_connection, send_mail
from django.test import TestCase, override_settings
from django.urls import reverse

from INSIGHTSAPI.tasks import add_numbers
from payslip.models import Payslip
from payslip.views import send_payslip


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

    # Check if the task is able to be executed
    def test_send_payslip_task(self):
        """Test if the tasks are working."""
        data = {
            "title": "title",
            "identification": "identification",
            "name": "name",
            "area": "area",
            "job_title": "job_title",
            "salary": 1000000,
            "days": 15,
            "biweekly_period": 15,
            "transport_allowance": 150000,
            "bearing": 300000,
            "surcharge_night_shift_hours": 15,
            "surcharge_night_shift_allowance": 150000,
            "surcharge_night_shift_holiday_hours": 15,
            "surcharge_night_shift_holiday_allowance": 150000,
            "surcharge_holiday_hours": 15,
            "surcharge_holiday_allowance": 150000,
            "bonus_paycheck": 150000,
            "biannual_bonus": 150000,
            "severance": 150000,
            "gross_earnings": 1000000,
            "healthcare_contribution": 150000,
            "pension_contribution": 150000,
            "tax_withholding": 150000,
            "additional_deductions": 150000,
            "apsalpen": 150000,
            "solidarity_fund_percentage": 0.015,
            "solidarity_fund": 150000,
            "total_deductions": 150000,
            "net_pay": 150000,
        }
        payslip = Payslip(**data)
        response = send_payslip([payslip])
        self.assertEqual(response.status_code, 201)


@override_settings(
    EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend",
)
class CustomEmailBackendTestCase(TestCase):
    """Test case for the CustomEmailBackend class."""

    def test_send_messages(self):
        """Test the send_messages method."""
        backend = get_connection()
        email = EmailMessage(
            "Test Send mail class",
            "This is a test message if you receive this email, the test was successful.",
            None,
            [settings.EMAIL_FOR_TEST],
            connection=backend,
        )
        email.send()
        self.assertEqual(len(backend.outbox), 1)

    def test_send_messages_to_wrong_email(self):
        """Test the send_messages method."""
        try:
            email = EmailMessage(
                "Subject here",
                "Here is the message.",
                None,
                ["not_allowed_email@not_allowed.com"],
                connection=get_connection(),
            )
            email.send()
            self.fail("Email should not be sent.")
        except Exception as e:
            self.assertIn("not allowed in test mode", str(e))

    @override_settings(
        ADMINS=[("Heibert Mogollon", settings.EMAIL_FOR_TEST)],
        DEBUG=False,  # Ensure DEBUG is False to enable email sending on errors
    )
    def test_admin_email_on_server_error(self):
        """Test that an email is sent to the admins on a server error."""
        with self.assertRaises(Exception) as context:
            self.client.get(reverse("trigger_error"))

        self.assertIn("Test error", str(context.exception))

    def test_send_html_mail(self):
        """Test the send_html_mail method."""
        backend = get_connection()
        email = EmailMessage(
            "HTML Email class",
            "Here is the message.",
            None,
            [settings.EMAIL_FOR_TEST],
            connection=backend,
        )
        email.content_subtype = "html"
        email.send()
        self.assertEqual(len(backend.outbox), 1)

    def test_send_mail(self):
        """Test the send_mail method."""
        backend = get_connection()
        send_mail(
            "Send mail test",
            "Here is the message.",
            None,
            [settings.EMAIL_FOR_TEST],
            connection=backend,
        )
        self.assertEqual(len(backend.outbox), 1)

    def test_send_mail_html(self):
        """Test the send_mail method."""
        backend = get_connection()
        send_mail(
            "HTML Send mail test",
            "Here is the message.",
            None,
            [settings.EMAIL_FOR_TEST],
            html_message="<h1>HTML message</h1>",
            connection=backend,
        )
        self.assertEqual(len(backend.outbox), 1)
