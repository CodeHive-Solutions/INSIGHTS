from django.contrib.auth.models import Group
from django.urls import reverse

from services.tests import BaseTestCase
from users.models import User

from .models import Complaint


# Create your tests here.
class ComplaintViewTest(BaseTestCase):
    """Test for Complaint view."""

    databases = {"default", "staffnet"}

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        # This group is created in the migration 0003_auto_20241007_1158.py
        self.group = Group.objects.get(name="coexistence_committee")
        self.sst = Group.objects.get(name="sst")
        self.user.groups.add(self.group)
        self.user.groups.add(self.sst)
        self.reason = "Test"
        self.complaint = Complaint.objects.create(
            reason=self.reason, description="Test1"
        )

    def test_create_complaint(self):
        """Test create complaint."""
        response = self.client.post(
            reverse("complaint-list"),
            {
                "reason": self.reason,
                "description": "Test1",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_get_complaints(self):
        """Test get complaints."""
        Complaint.objects.create(reason="Test2", description="Test2")
        response = self.client.get(reverse("complaint-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 2)

    def test_get_complaint(self):
        """Test get complaint."""
        response = self.client.get(
            reverse("complaint-detail", args=[self.complaint.pk])
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["description"], "Test1")
        self.assertEqual(response.data["reason"], "Test")

    def test_get_complaints_no_permission(self):
        """Test get complaints without permission."""
        self.user.groups.remove(self.group)
        response = self.client.get(reverse("complaint-list"))
        self.assertEqual(response.status_code, 403, response.data)
