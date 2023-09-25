"""Test module for the excels_processing app"""
from django.test import TestCase
from django.db import transaction
from django.urls import reverse
from rest_framework.test import APIClient
import mysql.connector

class FilesTestCase(TestCase):
    """Test case for the files endpoint"""
    def setUp(self):
        self.client = APIClient()

    def test_upload_file(self):
        """Test uploading a file to the server"""
        db_config = {
            'user': 'blacklistuser',
            'password': 'a4dnAGc-',
            'host': '172.16.0.9',
            'port': '3306',
            'database': 'asteriskdb',
        }
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        with transaction.atomic():
            file_path = '/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx'
            with open(file_path, 'rb') as file_obj:
                response = self.client.post(reverse('robinson_list'), {'file': file_obj})
            self.assertEqual(response.status_code, 200)
            cursor.execute('SELECT * FROM asteriskdb.blacklist WHERE numero = 1234567890;')
            self.assertIsNotNone(cursor.fetchone(), "Registro no encontrado")
        cursor.execute('SELECT * FROM asteriskdb.blacklist WHERE numero = 1234567890;')
        self.assertIsNone(cursor.fetchone(), "Registro encontrado")
