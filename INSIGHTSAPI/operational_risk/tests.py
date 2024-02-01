from django.test import TestCase
from django.urls import reverse
from services.tests import BaseTestCase
from django.contrib.auth.models import Permission


class OperationalRiskTest(BaseTestCase):
    """Test for operational risk."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        self.user.user_permissions.add(
            Permission.objects.get(codename="view_operationalrisk")
        )
        

    def test_get_operational_risk(self):
        """Test get operational risk."""
        response = self.client.get(reverse("operationalrisk-list", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
