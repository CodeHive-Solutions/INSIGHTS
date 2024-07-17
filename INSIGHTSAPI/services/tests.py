"""Test for services. """

import os
import requests
import holidays
from rest_framework.test import APITestCase
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.conf import settings
from users.models import User
from hierarchy.models import Area, JobPosition


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
        """Create a demo user for tests."""
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

    def create_demo_user_admin(self):
        """Create a demo user with admin permissions."""
        # Set the id and 
        demo_user = User.objects.get_or_create(
            pk=999,
            username="demo_admin",
            email=settings.EMAIL_FOR_TEST,
            first_name="Admin Demo",
            last_name="User",
            area=Area.objects.get_or_create(name="Admin")[0],
            job_position=JobPosition.objects.get_or_create(name="Admin", rank=100)[0],
            is_staff=True,
            is_superuser=True,
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

class HolidayTest(TestCase):
    """Test for holidays."""

    def test_holiday(self):
        """Test that the holiday is a holiday."""
        self.assertTrue(holidays.Colombia().get("2022-01-01"))

    def test_non_holiday(self):
        """Test that the day is not a holiday."""
        self.assertFalse(holidays.Colombia().get("2022-01-02"))

    def test_get_holidays(self):
        """Test that the holidays are retrieved."""
        response = self.client.get("/services/holidays/2024/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, holidays.CO(years=2024).items())