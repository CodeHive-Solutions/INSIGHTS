from django.test import TestCase
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
        print("Get_All",response.json())
        self.assertEqual(response.status_code, 200)
        # Additional assertions for the response data

    def test_get_single_goal(self):
        response = self.client.get(reverse('goal-detail', args=[1]))
        print("Get_One",response.json())
        self.assertEqual(response.status_code, 200)
        # Additional assertions for the response data

    def test_create_goal(self):
        data = {'campaign': 'Creation of Goal', 'value': '1000000.23'}
        response = self.client.post(reverse('goal-list'), data, format='json')
        if response.status_code == 201:
            print("Creacion Exitosa")
        self.assertEqual(response.status_code, 201)