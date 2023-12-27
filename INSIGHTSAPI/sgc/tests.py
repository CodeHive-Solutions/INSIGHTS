"""Test module for SGC"""
import os
from django.core.files.base import ContentFile
import tempfile
import shutil
from services.tests import BaseTestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from hierarchy.models import Area
import mysql.connector
from .models import SGCFile
import base64


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
        for i in range(1, 12):
            area = Area.objects.create(name=f"Area {i}")
        user = User.objects.get(username="StaffNet")
        permission_add = Permission.objects.get(codename="add_sgcfile")
        user.user_permissions.add(permission_add)
        permission_change = Permission.objects.get(codename="change_sgcfile")
        user.user_permissions.add(permission_change)
        permission_delete = Permission.objects.get(codename="delete_sgcfile")
        user.user_permissions.add(permission_delete)
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
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        file_exist = os.path.exists(
            os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
        )
        self.assertTrue(file_exist, os.listdir(self.media_directory))

    # def test_create_file_without_permission(self):
    #     """Test creating a file without permission"""
    #     user = User.objects.get(username="StaffNet")
    #     user.user_permissions.clear()
    #     user.save()
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     # Assert that the response status code is HTTP 403 Forbidden
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_create_file_without_area(self):
    #     """Test creating a file without area"""
    #     self.file_data.pop("area")
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     # Assert that the response status code is HTTP 400 Bad Request
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_create_file_with_invalid_file(self):
    #     """Test creating a file with invalid file"""
    #     self.file_data["file"] = SimpleUploadedFile("Test_SGC_Robinson.xlsx", b"")
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_create_file_with_invalid_file_extension(self):
    #     """Test creating a file with invalid file extension"""
    #     self.file_data["file"] = SimpleUploadedFile("Test_SGC_Robinson.txt", b"")
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_create_large_file(self):
    #     """Test creating a large file"""
    #     self.file_data["file"].size = 100000001
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_file(self):
        """Test updating a file"""
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        print(response.data)
        SGCFile.objects.create(**self.file_data)
        print(os.listdir(self.media_directory))
        self.file_data["name"] = "Test File Updated"
        self.file_data["file"] = SimpleUploadedFile(
            "Test_SGC_Robinson.xlsx", b"Test File Updated"
        )
        response = self.client.put(
            reverse("SGCFile-detail", kwargs={"pk": SGCFile.objects.first().id}),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        file_exist = os.path.exists(
            os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
        )
        print(f"Using {self.media_directory} as media directory")
        self.assertTrue(file_exist)

    def test_update_file_without_permission(self):
        """Test updating a file without permission"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        file = SGCFile.objects.create(**self.file_data)
        self.file_data["name"] = "Test File Updated"
        response = self.client.put(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_file(self):
        """Test deleting a file"""
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.delete(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 204 No Content
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        file_exist = os.path.exists(
            os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
        )
        self.assertFalse(file_exist)

    def test_delete_file_without_permission(self):
        """Test deleting a file without permission"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.delete(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def tearDown(self):
        """Tear down for the test"""
        super().tearDown()
        if self.media_directory.startswith("/tmp"):
            shutil.rmtree(self.media_directory)
            # pass
        else:
            print(f"Not removing {self.media_directory}")
