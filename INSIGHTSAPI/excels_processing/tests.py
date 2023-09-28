"""Test module for the excels_processing app"""
import os
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
import mysql.connector


class FilesTestCase(TestCase):
    """Test case for the files endpoint"""

    def setUp(self):
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
        self.select_query = (
            "SELECT * FROM asteriskdb.blacklist WHERE numero IN (3103233724,1234567890);"
        )

    def test_upload_file(self):
        """Test uploading a file to the server"""
        cursor = self.cursor
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx"
        file_obj = open(file_path, "rb")
        response = self.client.post(reverse("robinson-list"), {"file": file_obj})
        self.assertEqual(response.status_code, 200)
        self.connection.commit()
        cursor.execute(self.select_query)
        self.assertEqual(cursor.fetchone()[0], 3103233724)

    def tearDown(self):
        self.cursor.execute(
            "DELETE FROM asteriskdb.blacklist WHERE numero IN (3103233724,123456789);"
        )
        self.cursor.execute(self.select_query)
        self.assertIsNone(self.cursor.fetchone())
        self.connection.commit()
        self.connection.close()
