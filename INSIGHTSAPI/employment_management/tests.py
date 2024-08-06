"""Tests for the employment management app."""

from django.conf import settings
from django.contrib.auth.models import Permission
from django.urls import reverse
from django.test import override_settings
from services.tests import BaseTestCase
from payslip.models import Payslip
from .models import EmploymentCertification


@override_settings(
    EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend",
)
class EmploymentCertificationTest(BaseTestCase):
    """Tests the employment certification views."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.payslip_data = {
            "title": "title",
            "identification": settings.TEST_CEDULA,
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
            "solidarity_fund_percentage": 0.015,
            "solidarity_fund": 150000,
            "total_deductions": 150000,
            "severance": 150000,
            "net_pay": 150000,
        }

    def test_get_my_employment_certification(self):
        """Tests that the user can get the simple employment certification don't need months."""
        self.user.cedula = self.payslip_data["identification"]
        # self.user.cedula = "1001185389"
        self.user.save()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_my_employment_certification_with_months(self):
        """Tests that the user can get the employment certification with months."""
        self.user.cedula = self.payslip_data["identification"]
        self.user.save()
        Payslip.objects.create(**self.payslip_data)
        response = self.client.post(
            reverse("send-employment-certification"), {"months": 1}
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_get_my_employment_certification_without_have_the_months(self):
        """Tests that the user can't get the employment certification with months."""
        response = self.client.post(
            reverse("send-employment-certification"), {"months": 6}
        )
        self.assertEqual(response.status_code, 404, response.content)

    def test_create_and_send_another_employment_certification_with_identification(self):
        """Tests that the user can get another user's employment certification with identification."""
        demo_user = self.create_demo_user()
        demo_user.cedula = self.payslip_data["identification"]
        demo_user.save()
        get_permission = Permission.objects.get(codename="get_employment_certification")
        self.user.user_permissions.add(get_permission)
        self.user.save()
        response = self.client.post(
            reverse("send-employment-certification"),
            {"identification": self.payslip_data["identification"]},
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(EmploymentCertification.objects.count(), 1)

    def test_create_and_send_another_employment_certification_with_months_and_identification(self):
        """Tests that the user can get the employment certification with months and identification."""
        get_permission = Permission.objects.get(codename="get_employment_certification")
        self.user.user_permissions.add(get_permission)
        self.user.save()
        demo_user = self.create_demo_user()
        demo_user.cedula = self.payslip_data["identification"]
        demo_user.save()
        for _ in range(6):
            Payslip.objects.create(**self.payslip_data)
        response = self.client.post(
            reverse("send-employment-certification"),
            {"months": 6, "identification": self.payslip_data["identification"]},
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
            reverse("send-employment-certification"),
            {"identification": self.payslip_data["identification"]},
        )
        self.assertEqual(response.status_code, 403, response.content)

    def test_list_employment_certifications(self):
        """Tests that the user can list the employment certifications."""
        self.create_demo_user()
        get_permission = Permission.objects.get(codename="get_employment_certification")
        self.user.user_permissions.add(get_permission)
        self.user.save()
        for _ in range(6):
            EmploymentCertification.objects.create(
                user=self.user,
                start_date="2023-09-01",
                position=self.payslip_data["job_title"],
                salary=self.payslip_data["salary"],
                bonuses=self.payslip_data["bonus_paycheck"],
                contract_type="Contrato de trabajo",
                expedition_city="Bogotá",
            )
        response = self.client.get(reverse("get-employment-certifications"))
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(len(response.data), EmploymentCertification.objects.count())
        self.assertEqual(response.data[0]["cedula"], self.user.cedula)
        self.assertEqual(response.data[0]["position"], self.payslip_data["job_title"])
        self.assertEqual(response.data[0]["salary"], str(self.payslip_data["salary"]) + ".00")
        self.assertEqual(
            response.data[0]["bonuses"], str(self.payslip_data["bonus_paycheck"]) + ".00"
        )
        self.assertEqual(response.data[0]["contract_type"], "Contrato de trabajo")
        self.assertEqual(response.data[0]["expedition_city"], "Bogotá")
