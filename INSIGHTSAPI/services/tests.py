"""Test for services. """

import requests
import os
from datetime import timedelta
from io import StringIO
from rest_framework.test import APITestCase
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from django.core.management import call_command
from django.conf import settings
from contracts.models import Contract
from users.models import User
from .emails import send_email


class BaseTestCase(APITestCase):
    """Base test case for all test cases."""

    databases = set(["default", "staffnet"])

    def logout(self):
        """Logout the user."""
        self.client.post(reverse("destroy-token"), {}, cookies=self.client.cookies)  # type: ignore

    def setUp(self):
        """Set up the test case."""
        self.client.post(
            reverse("obtain-token"),
            {"username": "staffnet", "password": os.environ["StaffNetLDAP"]},
        )
        self.user = User.objects.get(username="staffnet")

    def create_demo_user(self):
        """Create a demo user."""
        demo_user = User.objects.get_or_create(
            username="demo",
            cedula="1000065648",
            email="heibert.mogollon@cyc-bpo.com",
            first_name="Demo",
            last_name="User",
        )
        # Return the user object not the tuple
        if isinstance(demo_user, tuple):
            return demo_user[0]
        return demo_user

    def tearDown(self):
        """Tear down the test case."""
        self.logout()


class StaticFilesTest(TestCase):
    """Test for static files."""

    def setUp(self):
        self.client = Client()

    def test_external_image_hosted(self):
        """Test that the external image is hosted."""
        url = f"https://{settings.ALLOWED_HOSTS[0]}/static/images/Logo_cyc_text.png"
        response = requests.get(url, timeout=5)
        self.assertEqual(response.status_code, 200)

    def test_nonexistent_static_file(self):
        """Test that a nonexistent static file returns a 404"""
        url = f"https://{settings.ALLOWED_HOSTS[0]}/static/services/non_exist_file.png"
        response = requests.get(url, timeout=5)
        self.assertEqual(response.status_code, 404)


class EmailServiceTest(APITestCase):
    """Test for email service."""

    def test_send_email(self):
        """Test send email."""
        subject = "Test email"
        message = "Test email"
        with open(
            str(settings.STATIC_ROOT) + "/images/Logo_cyc_text.png", "rb"
        ) as image_file:
            image_data = image_file.read()
            to_emails = [
                "heibert.mogollon@cyc-bpo.com",
                "heibert1.mogollon@gmail.com",
            ]
            errors = send_email(
                subject,
                message,
                to_emails,
                sender_user="mismetas",
                attachments=[("asesor-vacante.png", image_data, "image/png")],
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
        self.assertEqual(response.status_code, 200, response.data)

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
        self.assertEqual(response.status_code, 200, response.data)


class SchedulerTest(TestCase):
    """Test for scheduler."""

    def test_scheduler(self):
        """Test scheduler."""

        contract_data = {
            "name": "Contract 30 Days",
            "city": "Bogota",
            "description": "Test",
            "expected_start_date": timezone.now().date(),
            "value": 100000,
            "monthly_cost": 10000,
            "duration": timezone.now().date(),
            "contact": "Test",
            "contact_telephone": "123456789",
            "start_date": timezone.now().date(),
            "civil_responsibility_policy": "Test",
            "compliance_policy": "Test",
            "insurance_policy": "Test",
            "renovation_date": timezone.now().date() + timedelta(days=30),
        }

        contract_30_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date 15 days from now
        contract_data["name"] = "Contract 15 Days"
        contract_data["renovation_date"] = timezone.now().date() + timedelta(days=15)
        contract_15_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date 7 days from now
        contract_data["name"] = "Contract 7 Days"
        contract_data["renovation_date"] = timezone.now().date() + timedelta(days=7)
        contract_7_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date today
        contract_data["name"] = "Contract Today"
        contract_data["renovation_date"] = timezone.now().date()
        contract_today = Contract.objects.create(**contract_data)

        # Run the logic to check for contract renewal
        stdout = StringIO()
        management_command_output = call_command("run_scheduler", stdout=stdout)

        self.assertIn(
            f"Email sent for contract {contract_30_days.name} to ['heibert",
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_15_days.name} to ['heibert",
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_7_days.name} to ['heibert",
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_today.name} to ['heibert",
            stdout.getvalue(),
        )
