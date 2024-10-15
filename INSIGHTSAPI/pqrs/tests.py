""" Test for PQRS view. """

from django.urls import reverse
from hierarchy.models import Area, JobPosition
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

    def test_create_pqrs_operation_manager(self):
        """Test create pqrs for operation manager."""
        manager_position = JobPosition.objects.create(
            name="GERENTE DE OPERACIONES", rank=5
        )
        manager = self.create_demo_user()
        manager.job_position = manager_position
        manager.company_email = "test@cyc-bpo.com"
        manager.save()
        management = Management.objects.create(
            area="Gerencia de Operaciones", attendant=manager
        )
        manager_2 = self.create_demo_user()
        manager_2.job_position = manager_position
        manager_2.company_email = "test@cyc-bpo.com"
        manager_2.save()
        response = self.client.post(
            reverse("pqrs"),
            {
                "management": management.pk,
                "reason": "Test",
                "description": "Testing text",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(len(response.data), 6)
        self.assertEqual(
            response.data["attendants"],
            [
                {"Name": manager.get_full_name()},
                {"Name": manager_2.get_full_name()},
            ],
        )
