from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Goal

class GoalAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.goal = Goal.objects.create(campaign='Base Test Goal', value='99999.99')
        cls.goal2 = Goal.objects.create(campaign='Base Test Goal 2', value='50000.00')

    def setUp(self):
        self.client = APIClient()

    def test_get_all_goals(self):
        response = self.client.get(reverse('goal-list'))
        # print("Get_All",response.json())
        self.assertEqual(response.status_code, 200)
        # Additional assertions for the response data

    def test_get_single_goal(self):
        response = self.client.get(reverse('goal-detail', args=[self.goal.campaign]))
        # print("Get_One",response.json())
        self.assertEqual(response.status_code, 200)
        # Additional assertions for the response data

    def test_create_goal(self):
        data = {'campaign': 'Creation of Goal', 'value': '1000000.23'}
        response = self.client.post(reverse('goal-list'), data, format='json')
        # if response.status_code == 201:
        #     print("Creacion Exitosa")
        self.assertEqual(response.status_code, 201)

    def test_create_many_goals(self):
        data = [
            {'campaign': 'Creation of Goal 1', 'value': '1000000.23'},
            {'campaign': 'Creation of Goal 2', 'value': '1000000.23'}
        ]
        response = self.client.post(reverse('goal-list'), data, format='json')
        # print("Multiple creacion",response.json())
        # if response.status_code == 201:
        #     print("Creacion Exitosa")
        self.assertEqual(response.status_code, 201)

    def test_excel_upload(self):
        # Create a SimpleUploadedFile instance from the Excel file
        file_path = r'\\172.16.0.115\cyc_desarrollo\INSIGHTS\INSIGHTSAPI\goals\Cierre_Abril_2023_Consolidado_R.xlsx'
        with open(file_path, 'rb') as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile("Cierre_Abril_2023_Consolidado_R.xlsx", file_data, content_type="application/vnd.ms-excel")
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse('excel_goal-list'), {'file': excel_file})
        # Assert the response status code and perform additional assertions for the response data
        print("Excel", response.json())
        self.assertEqual(response.status_code, 201)
        # Additional assertions for the response data