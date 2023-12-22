from django.test import TestCase
from hierarchy.models import Area
from services.tests import BaseTestCase


# Create your tests here.
class PQRSViewTest(BaseTestCase):
    """Test for PQRS view."""

    databases = {"default", "staffnet"}

    def setUp(self):
        """Set up test."""
        super().setUp()
        self.area = Area.objects.create(name="Test")
        self.area.save()

    def test_create_complaint(self):
        """Test create complaint."""
        response = self.client.post(
            "/pqrs/complaints/",
            {
                "name-area": "MOGOLLON MAHECHA HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_create_congratulation(self):
        """Test create congratulation."""
        response = self.client.post(
            "/pqrs/congratulations/",
            {
                "name-area": "MOGOLLON MAHECHA HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_create_suggestion(self):
        """Test create suggestion."""
        response = self.client.post(
            "/pqrs/suggestions/",
            {
                "name-area": "MOGOLLON MAHECHA HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_create_other(self):
        """Test create other."""
        response = self.client.post(
            "/pqrs/others/",
            {
                "name-area": "MOGOLLON MAHECHA HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        """Tear down test."""
        self.area.delete()
