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
        permission = Permission.objects.get(codename="add_sgcfile")
        user.user_permissions.add(permission)
        user.save()
        temp_folder = tempfile.mkdtemp()
        self.media_directory = temp_folder
        settings.MEDIA_ROOT = self.media_directory
        print(self.media_directory)

    # def test_create_file(self):
    #     """Test creating a file"""
    #     response = self.client.post(
    #         reverse("SGCFile-list"),
    #         self.file_data,
    #         format="multipart",
    #         cookies=self.client.cookies,
    #     )
    #     # Assert that the response status code is HTTP 201 Created
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     file_exist = os.path.exists(
    #         os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
    #     )
    #     self.assertTrue(file_exist)

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

    def test_multi_upload(self):
        connection = mysql.connector.connect(
            host="172.16.0.6",
            user="root",
            password=os.environ["LEYES"],
            database="userscyc",
        )
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
        SELECT 
            area as area,
            tipo as type,
            subtipo as sub_type,
            nombre as name,
            archivo as file,
            version as version
        FROM userscyc.documentos_sgc
        """
        )
        rows = cursor.fetchall()
        self.assertGreater(len(rows), 0)
        cursor.close()
        connection.close()
        # print(rows)
        sgc_files_to_create = []
        for row in rows:
            content_file = ContentFile(row["file"])
            sgc_files_to_create.append(
                SGCFile(
                    name=row["name"],
                    area=Area.objects.get(id=row["area"]),
                    type=row["type"],
                    sub_type=row["sub_type"],
                    version=row["version"],
                    file=content_file,
                )
            )
        SGCFile.objects.bulk_create(sgc_files_to_create)
        self.assertEqual(len(SGCFile.objects.all()), len(rows))
        print(SGCFile.objects.first().file)

    def tearDown(self):
        """Tear down for the test"""
        super().tearDown()
        if self.media_directory.startswith("/tmp"):
            # shutil.rmtree(self.media_directory)
            pass
        else:
            print("Not removing %s" % self.media_directory)
