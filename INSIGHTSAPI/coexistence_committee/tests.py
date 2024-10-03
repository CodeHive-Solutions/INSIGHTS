from django.contrib.auth.models import Group
from django.urls import reverse

from services.tests import BaseTestCase

from .models import Complaint, Reason


# Create your tests here.
class ComplaintViewTest(BaseTestCase):
    """Test for Complaint view."""

    databases = {"default", "staffnet"}

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.user.groups.add(Group.objects.get(name="coexistence_committee"))
        self.reason = Reason.objects.create(
            reason="Test", attendant=self.user.job_position
        )
        self.complaint = Complaint.objects.create(
            reason=self.reason, description="Test1"
        )

    def test_create_complaint(self):
        """Test create complaint."""
        response = self.client.post(
            reverse("complaint-list"),
            {
                "reason": self.reason.pk,
                "description": "Test1",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_get_complaints(self):
        """Test get complaints."""
        Complaint.objects.create(reason=Reason.objects.first(), description="Test2")
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
        self.user.groups.remove("coexistence_committee")
        response = self.client.get(reverse("complaint-list"))
        self.assertEqual(response.status_code, 403, response.data)


class ReasonViewTest(BaseTestCase):
    """Test for Reason view."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.reason = Reason.objects.create(
            reason="Test", attendant=self.user.job_position
        )

    def test_get_reasons(self):
        """Test get reasons."""
        demo_user = self.create_demo_user()
        Reason.objects.create(reason="Test2", attendant=demo_user.job_position)
        response = self.client.get(reverse("reason-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["reason"], "Test")
        self.assertEqual(response.data[1]["reason"], "Test2")
        self.assertEqual(response.data[0]["attendant"], self.user.job_position.pk)
        self.assertEqual(response.data[1]["attendant"], demo_user.job_position.pk)
