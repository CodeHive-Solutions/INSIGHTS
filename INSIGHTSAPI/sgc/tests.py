"""Test module for SGC"""
import os
import tempfile
from services.tests import BaseTestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from hierarchy.models import Area
import shutil


class TestSGC(BaseTestCase):
    """Test module for SGC"""

    databases = "__all__"

    def setUp(self):
        """Set up for the test"""
        super().setUp()
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx", "rb"
        ) as file:
            file_content = file.read()
        self.file_data = {
            "name": "Test File",
            "area": Area.objects.first().name,
            "type": "Document",
            "sub_type": "xlsx",
            "file": SimpleUploadedFile("Test_SGC_Robinson.xlsx", file_content),
        }
        user = User.objects.get(username="StaffNet")
        permission = Permission.objects.get(codename="add_sgcfile")
        user.user_permissions.add(permission)
        user.save()
        temp_folder = tempfile.mkdtemp()
        self.media_directory = temp_folder
        settings.MEDIA_ROOT = self.media_directory

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
        file_exist = os.path.exists(
            os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
        )
        self.assertTrue(file_exist)

    def test_create_file_without_permission(self):
        """Test creating a file without permission"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def tearDown(self):
        """Tear down for the test"""
        super().tearDown()
        if self.media_directory.startswith("/tmp"):
            shutil.rmtree(self.media_directory)
        else:
            print("Not removing %s" % self.media_directory)
