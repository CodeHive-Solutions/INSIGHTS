"""Test module for SGC"""
import os
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from hierarchy.models import Area
from rest_framework.test import APIClient



class TestSGC(APITestCase):
    """Test module for SGC"""

    databases = "__all__"

    def setUp(self):
        """Set up for the test"""
        self.client = APIClient()
        username = "StaffNet"
        password = os.environ["StaffNetLDAP"]
        data = {
            "username": username,
            "password": password,
        }
        self.client.post(reverse("obtain-token"), data)
        # Check if the file exists
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx", "rb"
        ) as file:
            file_content = file.read()
        self.file_data = {
            "name": "Test File",
            "area": Area.objects.first().id,  # Replace with the appropriate area ID
            "type": "Document",
            "sub_type": "xlsx",
            "file": SimpleUploadedFile("Lista_Robinson.xlsx", file_content),
        }

        user = User.objects.get(username="StaffNet")
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
