from django.urls import reverse
from services.tests import BaseTestCase
from .models import EmploymentCertification


class EmploymentCertificationTest(BaseTestCase):
    """Tests the employment certification views."""

    def test_get_my_employment_certification(self):
        """Tests that the user can get the employment certification."""
        # self.user.cedula = "1000065648"
        self.user.cedula = "1001185389"
        self.user.save()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.data["email"], "HEIBERT.MOGOLLON@CYC-BPO.COM")
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_employment_certification_without_login(self):
        """Tests that the user cannot get the employment certification without logging in."""
        super().logout()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 401)

    def test_get_another_employment_certification_without_permission(self):
        """Tests that the user cannot get another user's employment certification without permission."""
        response = self.client.post(
            reverse("send-employment-certification"), {"identification": "1000065648"}
        )
        self.assertEqual(response.status_code, 403)
