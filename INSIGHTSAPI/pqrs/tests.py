""" Test for PQRS view. """

from django.urls import reverse
from hierarchy.models import Area
from services.tests import BaseTestCase

from .models import PQRS, Management


# Create your tests here.
class PQRSViewTest(BaseTestCase):
    """Test for PQRS view."""

    databases = {"default", "staffnet"}

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        area = Area.objects.create(name="Test")
        self.management = Management.objects.create(area=area, attendant=self.user)

    def test_get_pqrs(self):
        """Test get pqrs."""
        response = self.client.get(reverse("pqrs"))
        self.assertEqual(response.status_code, 405, response.data)

    def test_create_pqrs(self):
        """Test create pqrs."""
        response = self.client.post(
            reverse("pqrs"),
            {
                "management": self.management.pk,
                "reason": "Test",
                "description": "Testing text",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_get_management(self):
        """Test get management."""
        response = self.client.get(reverse("management"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["area"], "Test")
        self.assertEqual(response.data[0]["attendant"], self.user.pk)

    def test_get_pqrs(self):
        """Test get pqrs."""
        PQRS.objects.create(
            management=self.management,
            reason="Test",
            description="Testing text",
            user=self.user,
        )
        response = self.client.get(reverse("pqrs"))
        self.assertEqual(response.status_code, 405, response.data)
