"""Test module for the excels_processing app"""
import os
from users.models import User
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.db import transaction
from rest_framework.test import APITestCase
import mysql.connector


class RobinsonTestCase(APITestCase):
    """Test case for the files endpoint"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case"""
        username = "staffnet"
        password = os.environ["StaffNetLDAP"]
        self.login_data = {
            "username": username,
            "password": password,
        }
        db_config = {
            "user": "blacklistuser",
            "password": os.environ["black_list_pass"],
            "host": "172.16.0.9",
            "port": "3306",
            "database": "asteriskdb",
        }
        self.query = "SELECT * FROM asteriskdb.blacklist WHERE numero IN (3103233724,1234567890);"
        self.client.post(reverse("obtain-token"), self.login_data)
        self.connection = mysql.connector.connect(**db_config)
        self.cursor = self.connection.cursor()

    def test_upload_robinson_file(self):
        """Test uploading a robinson file to the server"""
        print("Testing upload robinson file")
        user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(codename="upload_robinson_list")
        user.user_permissions.add(permission)
        user.save()
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx"
        with open(file_path, "rb") as file_obj:
            response = self.client.post(reverse("robinson-list"), {"file": file_obj}, cookies=self.client.cookies)  # type: ignore
            self.assertEqual(response.status_code, 201, response.data)
            self.assertEqual(response.data["rows_updated"], 2)  # type: ignore
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


class CallTransferTestCase(APITestCase):
    """Test case for the files endpoint"""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case"""
        username = "staffnet"
        password = os.environ["StaffNetLDAP"]
        self.login_data = {
            "username": username,
            "password": password,
        }
        self.client.post(reverse("obtain-token"), self.login_data)

    def test_upload_call_transfer_file(self):
        """Test uploading a call transfer file to the server"""
        request = self.client.post(reverse("call-transfer-list"))
        self.assertEqual(request.status_code, 403)
        user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(codename="call_transfer")
        user.user_permissions.add(permission)
        user.save()
        with open(
            "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/informe_gestion.csv",
            "r",
            encoding="utf-8",
        ) as file_obj:
            response = self.client.post(
                reverse("call-transfer-list"),
                {"file": file_obj, "campaign": "test"},
                cookies=self.client.cookies,  # type: ignore
            )
            self.assertEqual(response.status_code, 200, response.data)
            self.assertEqual(response.data["fails"], [])
            # Check if the file was copied to the server
            file_path = "/var/servers/test/OUT-20231201-153739_3103233725-16072-37842888-all.mp3"
            self.assertTrue(os.path.exists(file_path))

    def tearDown(self):
        """Tear down the test case"""
        file_path = (
            "/var/servers/test/OUT-20231201-153739_3103233725-16072-37842888-all.mp3"
        )
        if os.path.exists(file_path):
            os.remove(file_path)
