"""Test module for SGC"""

import os
import tempfile
from services.tests import BaseTestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.test import override_settings
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import SGCFile, SGCArea


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
class TestSGC(BaseTestCase):
    """Test module for SGC"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up for the test"""
        super().setUp()
        with open("utils/excels/Lista_Robinsón.xlsx", "rb") as file:
            file_content = file.read()
        area = SGCArea.objects.create(short_name="SGC", name="SistemaGC")
        self.file_data = {
            "name": "Test Filé",
            "area": area.name,
            "type": "Document",
            "sub_type": "xlsx",
            "version": "1.0",
            "file": SimpleUploadedFile("Test_SGC_Robinsón.xlsx", file_content),
        }
        user = User.objects.get(username="StaffNet")
        permission_add = Permission.objects.get(codename="add_sgcfile")
        user.user_permissions.add(permission_add)
        permission_change = Permission.objects.get(codename="change_sgcfile")
        user.user_permissions.add(permission_change)
        permission_delete = Permission.objects.get(codename="delete_sgcfile")
        user.user_permissions.add(permission_delete)
        user.save()

    def test_get_file(self):
        """Test getting a file"""
        self.file_data["area"] = SGCArea.objects.first()
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.get(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data.get("name"), "Test Filé")
        self.assertEqual(response.data.get("area"), "SistemaGC")
        self.assertEqual(response.data.get("type"), "Document")
        self.assertEqual(response.data.get("sub_type"), "xlsx")
        self.assertEqual(response.data.get("version"), "1.0")
        self.assertIsNotNone(response.data.get("file"))

    def test_get_list_of_files(self):
        """Test getting a list of files"""
        self.file_data["area"] = SGCArea.objects.first()
        SGCFile.objects.create(**self.file_data)
        response = self.client.get(
            reverse("SGCFile-list"),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data["objects"][0].get("name"), "Test Filé")
        self.assertEqual(len(response.data), 2)
        self.assertTrue(response.data["permissions"].get("add"))

    def test_create_xlsx_file(self):
        """Test creating a file"""
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_create_pdf_file(self):
        """Test creating a file"""
        with open("static/test/bienestar.pdf", "rb") as file:
            file_content = file.read()
        self.file_data["file"] = SimpleUploadedFile("bienestar.pdf", file_content)
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_create_file_with_invalid_file_extension(self):
        """Test creating a file with invalid file"""
        with open(
            str(settings.STATIC_ROOT) + "/images/Logo_cyc_text.png", "rb"
        ) as file:
            file_content = file.read()
        self.file_data["file"] = SimpleUploadedFile(
            "Test_SGC_Robinsón.xlsx", file_content
        )
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertIn("Formato de archivo no válido", response.data["file"][0])

    def test_create_file_with_invalid_file(self):
        """Test creating a file with invalid file extension"""
        self.file_data["file"] = SimpleUploadedFile("Test_SGC_Robinsón.xlsx", b"12")
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Formato de archivo no válido", response.data["file"][0])

    def test_create_large_file(self):
        """Test creating a large file"""
        self.file_data["file"].name = "Test_SGC_Robinsón_large.xlsx"
        with tempfile.NamedTemporaryFile() as temp_file:
            temp_file.write(b"0" * 10000001)
            temp_file.seek(0)
            self.file_data["file"] = SimpleUploadedFile(
                "Test_SGC_Robinsón_large.xlsx", temp_file.read()
            )
            response = self.client.post(
                reverse("SGCFile-list"),
                self.file_data,
                format="multipart",
                cookies=self.client.cookies,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn(
                "El archivo no puede pesar mas de 10MB", response.data["file"]
            )

    def test_update_file_without_permission(self):
        """Test updating a file without permission"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        self.file_data["area"] = SGCArea.objects.first()
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

    def test_update_file(self):
        """Test updating a file"""
        self.file_data["area"] = SGCArea.objects.first()
        file = SGCFile.objects.create(**self.file_data)
        with open(
            "utils/excels/Entrega de metas ejemplo Claro-ENERO-2028.xlsx", "rb"
        ) as file_data:
            file_content = file_data.read()
        self.file_data["file"] = SimpleUploadedFile(
            "Test_SGC_Robinsón_updated.xlsx", file_content
        )
        self.file_data["name"] = "Test File Updated"
        response = self.client.put(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data.get("name"), "Test File Updated")

    def test_delete_file(self):
        """Test deleting a file"""
        self.file_data["area"] = SGCArea.objects.first()
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.delete(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 204 No Content
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_file_without_permission(self):
        """Test deleting a file without permission"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        self.file_data["area"] = SGCArea.objects.first()
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.delete(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_massive_update(self):
    #     """Test massive update"""
    #     SGCArea.objects.first().delete()
    #     response = self.client.get(
    #         reverse("massive-update"),
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
    #     self.assertGreater(SGCFile.objects.count(), 0)
    #     self.assertEqual(response.data["message"], "Archivos creados")
