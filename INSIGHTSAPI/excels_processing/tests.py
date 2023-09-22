from django.test import TestCase
from rest_framework.test import APIClient
from django.db import transaction

# Create your tests here.
class FilesTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_upload_file(self):
        with transaction.atomic():
            file_path = '/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Lista_Robinson.xlsx'
            with open(file_path, 'rb') as file_obj:
                response = self.client.post('/files/lista_robinson/', {'file': file_obj})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content, b'File uploaded successfully')