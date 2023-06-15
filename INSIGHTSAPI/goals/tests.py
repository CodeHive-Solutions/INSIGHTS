from django.test import TestCase
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Goals

class GoalAPITestCase(TestCase):
    # @classmethod
    # def setUpTestData(cls):
        # cls.goal = Goal.objects.create(campaign='Base Test Goal', value='99999.99')
        # cls.goal2 = Goal.objects.create(campaign='Base Test Goal 2', value='50000.00')

    def setUp(self):
        self.client = APIClient()

    def test_excel_upload(self):
        # Create a SimpleUploadedFile instance from the Excel file
        file_path = r'\\172.16.0.115\cyc_desarrollo\INSIGHTS\INSIGHTSAPI\goals\Cierre_Abril_2023_Consolidado_R.xlsx'
        with open(file_path, 'rb') as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile("Cierre_Abril_2023_Consolidado_R.xlsx", file_data, content_type="application/vnd.ms-excel")
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse('goal-list'), {'file': excel_file})
        # Assert the response status code and perform additional assertions for the response data
        print("Excel", response.json())
        self.assertEqual(response.status_code, 201)
        # Additional assertions for the response data

class SendEmailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('goal-send-email')
        self.heibert = Goals.objects.create(
            cedula='1000065648',
            name = 'Heibert',
            campaign = 'Base Test Goal',
            result = '100',
            evaluation = '100',
            quality = '100',
            clean_desk = '100',
            total = '100',
            job_title = 'Developer',
            created_at = timezone.now(),
            criteria = '100',
            quantity = '100',
        )

    def test_send_email_success(self):
        # Prepare the necessary data for the request
        payload = {
            'pdf': "This_dont_work",
            'cedula': '1000065648',  # Provide an existing cedula value from your database
            'delivery_type': 'Testing'
        }

        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)

        data = response.json()
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', data)

        # Assert that the email was sent successfully by checking the database or email logs

    def test_send_email_missing_data(self):
        # Prepare the request with missing data
        payload = {
            'pdf': 'base64_encoded_pdf_data',
            # Missing 'cedula' and 'delivery_type'
        }
        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertIn('Error', data)
        # Assert that the email was not sent and handle the specific error case

    def test_send_email_invalid_cedula(self):
        # Prepare the request with an invalid cedula value
        payload = {
            'pdf': 'base64_encoded_pdf_data',
            'cedula': '999999999999',  # Provide a non-existing cedula value
            'delivery_type': 'Some Delivery Type'
        }
        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)