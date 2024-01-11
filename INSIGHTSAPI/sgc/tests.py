"""Test module for SGC"""
import os
import shutil
from services.tests import BaseTestCase
from rest_framework import status
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile
from hierarchy.models import Area
from .models import SGCFile


class TestSGC(BaseTestCase):
    """Test module for SGC"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up for the test"""
        super().setUp()
        with open("utils/excels/Lista_Robinson.xlsx", "rb") as file:
            file_content = file.read()
        self.file_data = {
            "name": "Test File",
            "area": "SGC",
            "type": "Document",
            "sub_type": "xlsx",
            "version": "1.0",
            "file": SimpleUploadedFile("Test_SGC_Robinson.xlsx", file_content),
        }
        # for i in range(1, 12):
        # area = Area.objects.create(name=f"Area {i}")
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

    def test_get_file(self):
        """Test getting a file"""
        file = SGCFile.objects.create(**self.file_data)
        response = self.client.get(
            reverse("SGCFile-detail", kwargs={"pk": file.id}),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data.get("name"), "Test File")
        self.assertEqual(response.data.get("area"), "SGC")
        self.assertEqual(response.data.get("type"), "Document")
        self.assertEqual(response.data.get("sub_type"), "xlsx")
        self.assertEqual(response.data.get("version"), "1.0")
        self.assertEqual(response.data.get("file"), None)

    def test_get_list_of_files(self):
        """Test getting a list of files"""
        SGCFile.objects.create(**self.file_data)
        response = self.client.get(
            reverse("SGCFile-list"),
            cookies=self.client.cookies,
        )
        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data["objects"][0].get("name"), "Test File")
        self.assertTrue(response.data["permissions"].get("add"))

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

    def test_create_file_with_invalid_file(self):
        """Test creating a file with invalid file"""
        with open("static/logo_cyc.png", "rb") as file:
            file_content = file.read()
        self.file_data["file"] = SimpleUploadedFile(
            "Test_SGC_Robinson.xlsx", file_content
        )
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_file_with_invalid_file_extension(self):
        """Test creating a file with invalid file extension"""
        self.file_data["file"] = SimpleUploadedFile("Test_SGC_Robinson.txt", b"")
        response = self.client.post(
            reverse("SGCFile-list"),
            self.file_data,
            format="multipart",
            cookies=self.client.cookies,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertRaises(ValueError)

    def test_create_large_file(self):
        """Test creating a large file"""
        self.file_data["file"].name = "Test_SGC_Robinson_large.xlsx"
        with tempfile.NamedTemporaryFile() as temp_file:
            temp_file.write(b"0" * 10000001)
            temp_file.seek(0)
            self.file_data["file"] = SimpleUploadedFile(
                "Test_SGC_Robinson_large.xlsx", temp_file.read()
            )
            response = self.client.post(
                reverse("SGCFile-list"),
                self.file_data,
                format="multipart",
                cookies=self.client.cookies,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
        print("Test for update file still not working")
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


# class TestSGCUpdate(BaseTestCase):
#     """Test module for SGC Created to avoid the file not being created in the media directory if do it in the same request that create"""

#     databases = ["default", "staffnet"]

#     def setUp(self):
#         """Set up for the test"""
#         super().setUp()
#         with open("utils/excels/Lista_Robinson.xlsx", "rb") as file:
#             file_content = file.read()
#         self.file_data = {
#             "name": "Test File",
#             "area": "SGC",
#             "type": "Document",
#             "sub_type": "xlsx",
#             "version": "1.0",
#             "file": SimpleUploadedFile("Test_SGC_Robinson.xlsx", file_content),
#         }
#         user = User.objects.get(username="StaffNet")
#         permission_add = Permission.objects.get(codename="add_sgcfile")
#         user.user_permissions.add(permission_add)
#         permission_change = Permission.objects.get(codename="change_sgcfile")
#         user.user_permissions.add(permission_change)
#         user.save()
#         temp_folder = tempfile.mkdtemp()
#         self.media_directory = temp_folder
#         settings.MEDIA_ROOT = self.media_directory

#     def test_update_file(self):
#         """Test updating a file"""
#         with open("utils/excels/Ejecución de metas-enerO-2022.xlsx", "rb") as file:
#             file_content = file.read()
#         self.file_data = {
#             "name": "Test File1",
#             "area": "SGC1",
#             "type": "Document1",
#             "sub_type": "xlsx1",
#             "version": "1.01",
#             "file": SimpleUploadedFile("Test_SGC_Robinson1.xlsx", file_content),
#         }
#         response = self.client.post(
#             reverse("SGCFile-list"),
#             self.file_data,
#             format="multipart",
#             cookies=self.client.cookies,
#         )
#         # Assert that the response status code is HTTP 201 Created
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
#         print(SGCFile.objects.first().file)
#         path = os.path.join(settings.MEDIA_ROOT, str(SGCFile.objects.first().file))
#         print(os.listdir(settings.MEDIA_ROOT))
#         file_exist = os.path.exists(
#             os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
#         )
#         self.assertTrue(file_exist, os.listdir(self.media_directory))
#         with open("utils/excels/Lista_Robinson.xlsx", "rb") as file:
#             file_content = file.read()
#         self.file_data["file"] = SimpleUploadedFile(
#             "Test_SGC_Robinson.xlsx", file_content
#         )
#         response = self.client.put(
#             reverse("SGCFile-detail", kwargs={"pk": SGCFile.objects.first().id}),
#             self.file_data,
#             format="multipart",
#             cookies=self.client.cookies,
#         )
#         # Assert that the response status code is HTTP 200 OK
#         self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
#         file_exist = os.path.exists(
#             os.path.join(self.media_directory, "files/SGC/Test_SGC_Robinson.xlsx")
#         )
#         self.assertTrue(file_exist)
