"""Test module for the excels_processing app"""
import os
from users.models import User
from django.contrib.auth.models import Permission
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
import mysql.connector
from api_token.tests import TokenCheckTest


class FilesTestCase(TestCase):
    """Test case for the files endpoint"""

    databases = "__all__"

    def setUp(self):
        """Set up the test case """
        self.client = APIClient()
        db_config = {
            "user": "blacklistuser",
            "password": os.environ["black_list_pass"],
            "host": "172.16.0.9",
            "port": "3306",
            "database": "asteriskdb",
        }
        self.connection = mysql.connector.connect(**db_config)
        self.cursor = self.connection.cursor()
        self.select_query = "SELECT * FROM asteriskdb.blacklist WHERE numero IN (3103233724,1234567890);"

    def test_upload_file(self):
        """Test uploading a file to the server"""
        TokenCheckTest.test_token_obtain(self) # type: ignore
        user = User.objects.get(username="heibert.mogollon")
        permission = Permission.objects.get(codename="upload_robinson_list")
        user.user_permissions.add(permission)
        user.save()
        cursor = self.cursor
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx"
        self.file_obj = open(file_path, "rb")
        response = self.client.post(reverse("robinson-list"), {"file": self.file_obj}, cookies=self.client.cookies) # type: ignore
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["rows_updated"], 1) # type: ignore
        self.connection.commit()
        self.file_obj.seek(0)
        response = self.client.post(reverse("robinson-list"), {"file": self.file_obj}, cookies=self.client.cookies) # type: ignore
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "No data was inserted.") # type: ignore
        cursor.execute(self.select_query)
        self.assertEqual(cursor.fetchone()[0], 3103233724) # type: ignore

    def tearDown(self):
        self.cursor.execute(
            "DELETE FROM asteriskdb.blacklist WHERE numero IN (3103233724,123456789);"
        )
        if self.file_obj:
            self.file_obj.close()
        self.cursor.execute(self.select_query)
        self.assertIsNone(self.cursor.fetchone())
        self.connection.commit()
        self.connection.close()
