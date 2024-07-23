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
            "surcharge_night_shift_hours": 15,
            "surcharge_night_shift_allowance": 150000,
            "surcharge_night_shift_holiday_hours": 15,
            "surcharge_night_shift_holiday_allowance": 150000,
            "surcharge_holiday_hours": 15,
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
            "net_pay": 150000,
        }

    def test_get_all_payslips(self):
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
        self.assertEqual(len(response.data), 3)

    def test_get_only_my_payslips(self):
        """Test get payslips without permission."""
        self.user.cedula = "1001185389"
        self.user.save()
        self.test_upload_payslip_file()
        response = self.client.get("/payslips/")
        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )
        self.assertEqual(len(response.data), 1)

    def test_get_payslip(self):
        """Test get payslip."""
        self.test_upload_payslip_file()
        payslip = Payslip.objects.filter(identification=settings.TEST_CEDULA).first()
        if not payslip:
            self.fail("Payslip not found")
        get = Permission.objects.get(codename="view_payslip")
        self.user.user_permissions.add(get)
        response = self.client.get(f"/payslips/{payslip.pk}/")
        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )
        self.assertEqual(response.data["title"], "SEGUNDA QUINCENA MES DE ENERO 2024")
        self.assertEqual(response.data["identification"], settings.TEST_CEDULA)
        self.assertEqual(response.data["name"], payslip.name)
        self.assertEqual(response.data["area"], "Ejecutivo")
        self.assertEqual(response.data["job_title"], "Cargo #3")
        self.assertEqual(response.data["salary"], "28227321.00")
        self.assertEqual(response.data["days"], 16)
        self.assertEqual(response.data["biweekly_period"], "14113661.00")
        self.assertEqual(response.data["transport_allowance"], "22000.00")
        self.assertEqual(response.data["surcharge_night_shift_hours"], "15.0")
        self.assertEqual(response.data["surcharge_night_shift_allowance"], "140000.00")
        self.assertEqual(response.data["surcharge_night_shift_holiday_hours"], "17.4")
        self.assertEqual(response.data["surcharge_night_shift_holiday_allowance"], "180000.00")
        self.assertEqual(response.data["surcharge_holiday_hours"], "20.0")
        self.assertEqual(response.data["surcharge_holiday_allowance"], "250000.00")
        self.assertEqual(response.data["bonus_paycheck"], "0.00")
        self.assertEqual(response.data["biannual_bonus"], "100800.00")
        self.assertEqual(response.data["severance"], "85325.00")
        self.assertEqual(response.data["gross_earnings"], "14113661.00")
        self.assertEqual(response.data["healthcare_contribution"], "395182.00")
        self.assertEqual(response.data["pension_contribution"], "493978.00")
        self.assertEqual(response.data["tax_withholding"], "1946500.00")
        self.assertEqual(response.data["additional_deductions"], "2225000.00")
        self.assertEqual(response.data["apsalpen"], "0.00")
        self.assertEqual(response.data["solidarity_fund_percentage"], "0.015")
        self.assertEqual(response.data["solidarity_fund"], "69000.00")
        self.assertEqual(response.data["total_deductions"], "5060661.00")
        self.assertEqual(response.data["net_pay"], "9053000.00")

    def test_get_another_person(self):
        """Test get payslip of another person."""
        self.test_upload_payslip_file()
        payslip = Payslip.objects.filter(identification=settings.TEST_CEDULA).first()
        response = self.client.get(f"/payslips/{payslip.pk}/")
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
            {"Error": "El archivo no tiene la cantidad de columnas requeridas de 28, tiene 2"},
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
        self.assertEqual(response.data["message"], "Desprendibles de nomina enviados")
        self.assertEqual(Payslip.objects.count(), 3)

    def test_upload_massive_file(self):
        """Test upload payslip file."""
        with open(
            str(settings.BASE_DIR) + "/utils/excels/Nomina_massive.csv",
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
        self.assertEqual(response.data["message"], "Desprendibles de nomina enviados")
        self.assertEqual(Payslip.objects.count(), 40)

    def test_resend_payslip(self):
        """Test resend payslip."""
        self.test_upload_payslip_file()
        payslip = Payslip.objects.filter(identification=settings.TEST_CEDULA).first()
        if not payslip:
            self.fail("Payslip not found")
        response = self.client.post(
            f"/payslips/{payslip.pk}/resend/", {"email": "heibert.mogollon12@gmail.com"}
        )
        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )
        self.assertEqual(response.data["message"], "Desprendibles de nomina enviados")
