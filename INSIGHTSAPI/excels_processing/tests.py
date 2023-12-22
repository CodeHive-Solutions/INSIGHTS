"""Test module for the excels_processing app"""
import os
from shutil import rmtree
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.conf import settings
from rest_framework.test import APITestCase
import mysql.connector
from services.tests import BaseTestCase


class RobinsonTestCase(APITestCase):
    """Test case for the files endpoint"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case"""
        username = "staffnet"
        password = os.getenv("StaffNetLDAP")
        self.login_data = {
            "username": username,
            "password": password,
        }
        self.client.post(reverse("obtain-token"), self.login_data)
        db_config = {
            "user": "blacklistuser",
            "password": os.getenv("black_list_pass"),
            "host": "172.16.0.9",
            "port": "3306",
            "database": "asteriskdb",
        }
        self.query = "SELECT * FROM asteriskdb.blacklist WHERE numero IN (3103233724,1234567890);"
        self.connection = mysql.connector.connect(**db_config)
        self.cursor = self.connection.cursor()

    def test_upload_robinson_file(self):
        """Test uploading a robinson file to the server"""
        user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(codename="upload_robinson_list")
        user.user_permissions.add(permission)
        user.save()
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx"
        with open(file_path, "rb") as file_obj:
            response = self.client.post(reverse("robinson-list"), {"file": file_obj}, cookies=self.client.cookies)  # type: ignore
            self.assertEqual(response.status_code, 201, response.data)
            self.assertEqual(response.data["updated_rows"], 2)  # type: ignore
            self.connection.commit()
            file_obj.seek(0)
            response = self.client.post(reverse("robinson-list"), {"file": file_obj}, cookies=self.client.cookies)  # type: ignore
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["message"], "No data was inserted.")  # type: ignore
            cursor = self.cursor
            cursor.execute(self.query)
            self.assertEqual(cursor.fetchone()[0], 3103233724)  # type: ignore

    def tearDown(self):
        self.cursor.execute(
            "DELETE FROM asteriskdb.blacklist WHERE numero IN (3103233724,123456789,3213213213);"
        )
        self.cursor.execute(self.query)
        self.assertIsNone(self.cursor.fetchone())
        self.connection.commit()
        self.connection.close()


class CallTransferTestCase(BaseTestCase):
    """Test case for the files endpoint"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case"""
        super().setUp()
        user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(codename="call_transfer")
        user.user_permissions.add(permission)
        user.save()
        path_quality = "/var/servers/calidad/test/test/2023/12/05/OUT"
        os.makedirs(path_quality, exist_ok=True)

    def test_upload_call_transfer_without_permission(self):
        """Test uploading a call transfer file to the server"""
        user = User.objects.get(username="StaffNet")
        user.user_permissions.clear()
        user.save()
        request = self.client.post(reverse("call-transfer-list"))
        self.assertEqual(request.status_code, 403)

    def test_upload_call_transfer_file_falabella(self):
        """Test uploading a call transfer file to the server"""
        # Create the folders for the test
        path_falabella = "/var/servers/falabella/test/test/2023/12/05/OUT"
        os.makedirs(path_falabella, exist_ok=True)
        with open(
            path_falabella + "/OUT-20231201-153739_3103233725-16072-37842888-all.mp3",
            "w",
            encoding="utf-8",
        ) as file_obj:
            file_obj.write("test")
            self.assertTrue(os.path.exists(file_obj.name), file_obj.name)
        # Open the file to upload
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Call_transfer_list.csv",
            "r",
            encoding="utf-8",
        ) as file_obj:
            response = self.client.post(
                reverse("call-transfer-list"),
                {"file": file_obj, "campaign": "test_falabella"},
                cookies=self.client.cookies,  # type: ignore
            )
            self.assertEqual(response.status_code, 200, response.data)  # type: ignore
            self.assertEqual(response.data["fails"], [], response.data)  # type: ignore
            # Check if the file was copied to the server
            file_path = "/var/servers/calidad/test/test/OUT-20231201-153739_3103233725-16072-37842888-all.mp3"
            self.assertTrue(os.path.exists(file_path))

    def test_upload_call_transfer_file_banco_agrario(self):
        """Test uploading a call transfer file to the server"""
        # Create the folders for the test
        path_banco_agrario = "/var/servers/banco_agrario/test/test/2023/12/05/OUT"
        os.makedirs(path_banco_agrario, exist_ok=True)
        with open(
            path_banco_agrario
            + "/76309250_72506917047_20231129-185927_3103233725_1411-all.mp3",
            "w",
            encoding="utf-8",
        ) as file_obj:
            file_obj.write("test")
            self.assertTrue(os.path.exists(file_obj.name), file_obj.name)
        # Open the file to upload
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Call_transfer_list_banco_agrario.csv",
            "r",
            encoding="utf-8",
        ) as file_obj:
            response = self.client.post(
                reverse("call-transfer-list"),
                {"file": file_obj, "campaign": "test_banco_agrario"},
                cookies=self.client.cookies,  # type: ignore
            )
            self.assertEqual(response.status_code, 200, response.data)

    def tearDown(self):
        """Tear down the test case"""
        file_path_quality = "/var/servers/calidad/test/"
        file_path_quality_check = file_path_quality + "test/2023/12/05/OUT"
        if os.path.exists(file_path_quality) and os.path.exists(
            file_path_quality_check
        ):
            rmtree(file_path_quality)
        file_path_falabella = "/var/servers/falabella/test/"
        file_path_falabella_check = file_path_falabella + "test/2023/12/05/OUT"
        if os.path.exists(file_path_falabella) and os.path.exists(
            file_path_falabella_check
        ):
            rmtree(file_path_falabella)
        file_path_banco_agrario = "/var/servers/banco_agrario/test/"
        file_path_banco_agrario_check = file_path_banco_agrario + "test/2023/12/05/OUT"
        if os.path.exists(file_path_banco_agrario) and os.path.exists(
            file_path_banco_agrario_check
        ):
            rmtree(file_path_banco_agrario)
