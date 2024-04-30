from django.urls import reverse
from services.tests import BaseTestCase
from django.contrib.auth.models import Permission
from payslip.models import Payslip
from .models import EmploymentCertification


class EmploymentCertificationTest(BaseTestCase):
    """Tests the employment certification views."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.payslip_data = {
            "title": "title",
            "identification": "1000065648",
            "name": "name",
            "area": "area",
            "job_title": "job_title",
            "salary": 1000000,
            "days": 15,
            "biweekly_period": 15,
            "transport_allowance": 150000,
            "surcharge_night_shift_hours": 10,
            "surcharge_night_shift_allowance": 150000,
            "surcharge_night_shift_holiday_hours": 10,
            "surcharge_night_shift_holiday_allowance": 150000,
            "surcharge_holiday_hours": 10,
            "surcharge_holiday_allowance": 150000,
            "bonus_paycheck": 150000,
            "biannual_bonus": 150000,
            "gross_earnings": 1000000,
            "healthcare_contribution": 150000,
            "pension_contribution": 150000,
            "tax_withholding": 150000,
            "additional_deductions": 150000,
            "apsalpen": 150000,
            "total_deductions": 150000,
            "severance": 150000,
            "net_pay": 150000,
        }

    def test_get_my_employment_certification(self):
        """Tests that the user can get the simple employment certification don't need months."""
        self.user.cedula = "1000065648"
        # self.user.cedula = "1001185389"
        self.user.save()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.data["email"], "HEIBERT.MOGOLLON@GMAIL.COM")
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_my_employment_certification_with_months(self):
        """Tests that the user can get the employment certification with months."""
        self.user.cedula = "1000065648"
        self.user.save()
        Payslip.objects.create(**self.payslip_data)
        response = self.client.post(
            reverse("send-employment-certification"), {"months": 1}
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_my_employment_certification_without_have_the_months(self):
        """Tests that the user can get the employment certification with months."""
        response = self.client.post(
            reverse("send-employment-certification"), {"months": 6}
        )
        self.assertEqual(response.status_code, 404, response.content)

    def test_get_another_employment_certification_with_identification(self):
        """Tests that the user can get another user's employment certification with identification."""
        self.create_demo_user()
        get_permission = Permission.objects.get(codename="get_employment_certification")
        self.user.user_permissions.add(get_permission)
        self.user.save()
        response = self.client.post(
            reverse("send-employment-certification"), {"identification": "1000065648"}
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_another_employment_certification_with_months_and_identification(self):
        """Tests that the user can get the employment certification with months and identification."""
        get_permission = Permission.objects.get(codename="get_employment_certification")
        self.user.user_permissions.add(get_permission)
        self.user.save()
        self.create_demo_user()
        for _ in range(6):
            Payslip.objects.create(**self.payslip_data)
        response = self.client.post(
            reverse("send-employment-certification"),
            {"months": 6, "identification": "1000065648"},
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_employment_certification_without_login(self):
        """Tests that the user cannot get the employment certification without logging in."""
        super().logout()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 401, response.content)

    def test_get_another_employment_certification_without_permission(self):
        """Tests that the user cannot get another user's employment certification without permission."""
        response = self.client.post(
            reverse("send-employment-certification"), {"identification": "1000065648"}
        )
        self.assertEqual(response.status_code, 403, response.content)

    # def test_something(self):
    #     response = self.client.get(reverse("upload-old-certifications"))
    #     self.assertEqual(response.status_code, 200)
