"""Test for payslip. """

from services.tests import BaseTestCase
from django.conf import settings
from django.contrib.auth.models import Permission
from .models import Payslip


class PayslipTest(BaseTestCase):
    """Test for payslip."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        add = Permission.objects.get(codename="add_payslip")
        update = Permission.objects.get(codename="change_payslip")
        delete = Permission.objects.get(codename="delete_payslip")
        self.user.user_permissions.add(add, update, delete)
        self.data = {
            "title": "title",
            "identification": "identification",
            "name": "name",
            "area": "area",
            "job_title": "job_title",
            "salary": 1000000,
            "days": 15,
            "biweekly_period": 15,
            "transport_allowance": 150000,
            "bonus_paycheck": 150000,
            "gross_earnings": 1000000,
            "healthcare_contribution": 150000,
            "pension_contribution": 150000,
            "tax_withholding": 150000,
            "additional_deductions": 150000,
            "apsalpen": 150000,
            "total_deductions": 150000,
            "net_pay": 150000,
        }

    def test_get_payslips(self):
        """Test get payslips."""
        self.test_upload_payslip_file()
        get = Permission.objects.get(codename="view_payslip")
        self.user.user_permissions.add(get)
        response = self.client.get("/payslips/")
        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )
        self.assertEqual(len(response.data), 2)

    def test_get_payslips_no_permission(self):
        """Test get payslips without permission."""
        response = self.client.get("/payslips/")
        self.assertEqual(
            response.status_code,
            403,
            response.data,
        )

    def test_get_payslip(self):
        """Test get payslip."""
        self.test_upload_payslip_file()
        response = self.client.get("/payslips/1000065648/")
        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )
        self.assertEqual(response.data["title"], "SEGUNDA QUINCENA MES DE ENERO 2024")
        self.assertEqual(response.data["identification"], "00000000")
        self.assertEqual(response.data["name"], "HEIBERT STEVEN MOGOLLON MAHECHA")
        self.assertEqual(response.data["area"], "Ejecutivo")
        self.assertEqual(response.data["job_title"], "Cargo #2")
        self.assertEqual(response.data["salary"], "28.227.321,00")
        self.assertEqual(response.data["days"], 15)
        self.assertEqual(response.data["biweekly_period"], "14.113.661,00")
        self.assertEqual(response.data["transport_allowance"], "0,00")
        self.assertEqual(response.data["bonus_paycheck"], "0,00")
        self.assertEqual(response.data["gross_earnings"], "14.113.661,00")
        self.assertEqual(response.data["healthcare_contribution"], "395.182,00")
        self.assertEqual(response.data["pension_contribution"], "493.978,00")
        self.assertEqual(response.data["tax_withholding"], "1.946.500,00")
        self.assertEqual(response.data["additional_deductions"], "2.225.000,00")
        self.assertEqual(response.data["apsalpen"], "0,00")
        self.assertEqual(response.data["total_deductions"], "5.060.661,00")
        self.assertEqual(response.data["net_pay"], "9.053.000,00")

    def test_get_another_person(self):
        """Test get payslip of another person."""
        self.test_upload_payslip_file()
        response = self.client.get("/payslips/0012343/")
        self.assertEqual(
            response.status_code,
            403,
            response.data,
        )

    def test_upload_payslip_file_no_file(self):
        """Test upload payslip file with no file."""
        response = self.client.post("/payslips/")
        self.assertEqual(
            response.status_code,
            400,
            response.data,
        )
        self.assertEqual(response.data, {"error": "Debes subir un archivo"})

    def test_upload_payslip_file_insufficient_columns(self):
        """Test upload payslip file with insufficient columns."""
        with open(
            str(settings.BASE_DIR) + "/utils/excels/Call_transfer_list.csv",
            "r",
            encoding="utf-8-sig",
        ) as file:
            response = self.client.post(
                "/payslips/",
                {"file": file},
                format="multipart",
            )
        self.assertEqual(
            response.status_code,
            400,
            response.data,
        )
        self.assertEqual(
            response.data,
            {"Error": "El archivo no tiene la cantidad de columnas requeridas."},
        )

    def test_upload_without_permission(self):
        """Test upload payslip file without permission."""
        self.user.user_permissions.clear()
        with open(
            str(settings.BASE_DIR) + "/utils/excels/Nomina.csv",
            "r",
            encoding="utf-8-sig",
        ) as file:
            response = self.client.post(
                "/payslips/",
                {"file": file},
                format="multipart",
            )
        self.assertEqual(
            response.status_code,
            403,
            response.data,
        )

    def test_upload_payslip_file(self):
        """Test upload payslip file."""
        with open(
            str(settings.BASE_DIR) + "/utils/excels/Nomina.csv",
            "r",
            encoding="utf-8-sig",
        ) as file:
            response = self.client.post(
                "/payslips/",
                {"file": file},
                format="multipart",
            )
        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )
        self.assertEqual(response.data, {"message": "Desprendibles de nomina creados"})
        self.assertEqual(Payslip.objects.count(), 2)
