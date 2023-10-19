"""Test module for SGC"""
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings


class TestSGC(APITestCase):
    """Test module for SGC"""

    databases = "__all__"

    def setUp(self):
        """Set up for the test"""
        username = "juan.carreno"
        password = "cyc2024<"
        data = {
            "username": username,
            "password": password,
        }
        # Check if the file exists
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx", "rb"
        ) as file:
            file_content = file.read()
        self.client.post(reverse("obtain-token"), data)
        self.file_data = {
            "name": "Test File",
            "area": 1,  # Replace with the appropriate area ID
            "type": "Document",
            "sub_type": "xlsx",
            "file": SimpleUploadedFile("Lista_Robinson.xlsx", file_content),
        }
        user = User.objects.get(username="juan.carreno")
        permission = Permission.objects.get(codename="add_sgcfile")
        user.user_permissions.add(permission)
        user.save()

    def test_create_file(self):
        """Test creating a file"""
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
