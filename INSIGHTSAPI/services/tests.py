"""Test for services. """

import os
from datetime import timedelta
from io import StringIO
import requests
from rest_framework.test import APITestCase
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.utils import timezone
from django.core.management import call_command
from django.conf import settings
from contracts.models import Contract
from users.models import User


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
            cedula=settings.TEST_CEDULA,
            email=settings.EMAIL_FOR_TEST,
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


class EthicalLineTest(APITestCase):
    """Test for ethical line."""

    @override_settings(
        EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
    )
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

    @override_settings(
        EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
    )
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
