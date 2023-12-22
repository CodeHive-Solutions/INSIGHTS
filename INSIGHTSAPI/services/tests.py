"""Test for services. """
import os
from rest_framework.test import APITestCase
from django.urls import reverse
from .emails import send_email


class BaseTestCase(APITestCase):
    """Base test case for all test cases."""

    def setUp(self):
        """Set up the test case."""
        self.client.post(
            reverse("obtain-token"),
            {"username": "staffnet", "password": os.environ["StaffNetLDAP"]},
        )

    def tearDown(self):
        """Tear down the test case."""
        self.client.post(reverse("destroy-token"), {}, cookies=self.client.cookies)  # type: ignore


# Create your tests here.
class EmailServiceTest(APITestCase):
    """Test for email service."""

    def test_send_email(self):
        """Test send email."""
        subject = "Test email"
        message = "Test email"
        to_emails = [
            "heibert.mogollon@cyc-bpo.com",
            "heibert1.mogollon@gmail.com",
        ]
        errors = send_email(
            "mismetas",
            subject,
            message,
            to_emails,
            save_message=False,
            email_owner="Test",
        )
        self.assertIsNone(errors, errors)


class EthicalLineTest(APITestCase):
    """Test for ethical line."""

    def test_send_report_ethical_line_without_contact(self):
        """Test send report ethical line."""
        response = self.client.post(
            "/services/send-ethical-line/",
            {
                "complaint": "Test Type Without contact",
                "description": "Test Description",
            },
        )
        self.assertEqual(response.status_code, 200)

    def test_send_report_ethical_line_with_contact(self):
        """Test send report ethical line."""
        response = self.client.post(
            "/services/send-ethical-line/",
            {
                "complaint": "Test Type with contact",
                "description": "Test Description",
                "contact_info": "Test contact info",
            },
        )
        self.assertEqual(response.status_code, 200)
