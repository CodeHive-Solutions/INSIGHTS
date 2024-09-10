"""This file contains the tests for the vacation model."""

from datetime import datetime
from hierarchy.models import Area
from freezegun import freeze_time
from services.tests import BaseTestCase
from rest_framework import status
from django.test import TestCase
from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.db.models import Q
from django.test import override_settings
from .utils import is_working_day, get_working_days, get_return_date
from .models import VacationRequest
from .serializers import VacationRequestSerializer


class WorkingDayTestCase(TestCase):
    """Test module for working day utility functions."""

    def test_is_working_day(self):
        """Test the is_working_day function."""
        self.assertTrue(is_working_day("2024-01-02"))
        self.assertFalse(is_working_day("2024-01-01"))
        self.assertTrue(is_working_day("2024-01-05"))
        self.assertTrue(is_working_day("2024-01-06"))
        self.assertFalse(is_working_day("2024-01-06", False))

    def test_get_working_days_no_sat(self):
        """Test the get_working_days function."""
        self.assertEqual(get_working_days("2024-01-02", "2024-01-05", False), 4)
        self.assertEqual(get_working_days("2024-01-01", "2024-01-05", False), 4)
        # The 8th is a holiday
        self.assertEqual(get_working_days("2024-01-01", "2024-01-09", False), 5)
        self.assertEqual(get_working_days("2024-01-01", "2024-01-23", False), 15)

    def test_get_working_days_sat(self):
        """Test the get_working_days function with Saturdays."""
        self.assertEqual(get_working_days("2024-01-02", "2024-01-05", True), 4)
        self.assertEqual(get_working_days("2024-01-01", "2024-01-05", True), 4)
        # The 8th is a holiday
        self.assertEqual(get_working_days("2024-01-01", "2024-01-09", True), 6)
        self.assertEqual(get_working_days("2024-01-01", "2024-01-19", True), 15)

    def test_get_return_date(self):
        """Test the get_return_date function."""
        self.assertEqual(get_return_date("2024-08-30", False), datetime(2024, 9, 2))
        self.assertEqual(get_return_date("2024-08-30", True), datetime(2024, 8, 31))
        self.assertEqual(get_return_date("2024-09-06", False), datetime(2024, 9, 9))
        self.assertEqual(get_return_date("2024-12-31", True), datetime(2025, 1, 2))


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
class VacationRequestModelTestCase(BaseTestCase):
    """Test module for VacationRequest model."""

    def setUp(self):
        """Create a user and a vacation request."""
        super().setUp()
        self.test_user = self.create_demo_user()
        self.user.job_position.rank = 2
        self.user.job_position.save()
        pdf = SimpleUploadedFile("test.pdf", b"file_content")
        self.permission = Permission.objects.get(codename="payroll_approbation")
        self.vacation_request = {
            "user": self.test_user.pk,
            "start_date": "2024-01-02",
            "end_date": "2024-01-18",
            "request_file": pdf,
        }

    def test_vacation_create(self):
        """Test creating a vacation endpoint."""
        self.vacation_request["hr_approbation"] = True  # This is just a check
        self.vacation_request["mon_to_sat"] = False
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["hr_approbation"], None)

    def test_vacation_create_no_mon_to_sat(self):
        """Test creating a vacation without mon_to_sat."""
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "Debes especificar si trabajas los sábados.",
        )

    @freeze_time("2024-07-01 10:00:00")
    def test_vacation_create_same_month(self):
        """Test creating a vacation that spans two months."""
        super().setUp()
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["start_date"] = "2024-07-22"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes solicitar vacaciones para el mes actual.",
        )

    def test_vacation_list_user(self):
        """Test listing all vacations endpoint for a user."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.create_demo_user_admin()
        VacationRequest.objects.create(**self.vacation_request)
        self.vacation_request["user"] = self.user
        self.vacation_request["uploaded_by"] = self.test_user
        VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(reverse("vacation-list"))
        vacation_requests = VacationRequest.objects.filter(user=self.user)
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(
            response.data, serializer.data, (response.data, serializer.data)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["user"], self.user.get_full_name())

    def test_vacation_list_hr(self):
        """Test listing all vacations endpoint for HR."""
        self.user.job_position.name = "GERENTE DE GESTION HUMANA"
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.test_user
        VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(reverse("vacation-list"))
        vacation_requests = VacationRequest.objects.all()
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_vacation_list_manager(self):
        """Test listing all vacations endpoint for a manager."""
        self.user.job_position.rank = 5
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        VacationRequest.objects.create(**self.vacation_request)
        self.vacation_request["user"] = self.user
        self.vacation_request["uploaded_by"] = self.test_user
        VacationRequest.objects.create(**self.vacation_request)
        # Change the area of the test user to match the user's area
        demo_user_admin = self.create_demo_user_admin()
        demo_user_admin.area = self.user.area
        demo_user_admin.save()
        demo_user_admin.job_position.rank = 1
        demo_user_admin.job_position.save()
        self.vacation_request["user"] = demo_user_admin
        self.vacation_request["uploaded_by"] = self.test_user
        VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(reverse("vacation-list"))
        vacation_requests = VacationRequest.objects.filter(
            (Q(uploaded_by=self.user) | Q(user=self.user))
            | (
                Q(user__job_position__rank__lt=self.user.job_position.rank)
                & Q(user__area=self.user.area)
            )
        ).order_by("-created_at")
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3, response.data)

    def test_vacation_list_manager_multiple_areas(self):
        """Test listing all vacations endpoint for a manager with multiple areas."""
        self.test_user.area.manager = self.user
        self.test_user.area.save()
        # Check that the user has a different area than the manager
        self.assertNotEqual(self.test_user.area, self.user.area)
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        VacationRequest.objects.create(**self.vacation_request)
        demo_user = self.create_demo_user()
        Area.objects.create(name="Test Area", manager=self.user)
        self.vacation_request["user"] = demo_user
        VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(reverse("vacation-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_vacation_retrieve(self):
        """Test retrieving a vacation endpoint."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["user"], self.vacation_request["user"].get_full_name()
        )
        self.assertEqual(
            response.data["start_date"], self.vacation_request["start_date"]
        )
        self.assertEqual(response.data["end_date"], self.vacation_request["end_date"])

    def test_vacation_create_end_before_start(self):
        """Test creating a vacation with the end date before the start date."""
        self.vacation_request["end_date"] = "2021-01-04"
        self.vacation_request["mon_to_sat"] = False
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["non_field_errors"][0],
            "La fecha de inicio no puede ser mayor a la fecha de fin.",
        )

    def test_vacation_create_invalid_rank(self):
        """Test creating a vacation with invalid rank."""
        self.vacation_request["mon_to_sat"] = False
        demo_user = self.test_user
        demo_user.job_position.rank = 8
        demo_user.job_position.save()
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes crear una solicitud para este usuario.",
        )

    def test_vacation_create_same_user_rank_lte_3(self):
        """Test creating a vacation for the same user."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["user"] = self.user.pk
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes subir solicitudes para ti mismo.",
            response.data,
        )

    def test_vacation_create_same_user_rank_gte_4(self):
        """Test creating a vacation for the same user with rank greater than 3."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["user"] = self.user.pk
        self.user.job_position.rank = 4
        self.user.job_position.save()
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_vacation_owner_cancel(self):
        """Test the owner cancelling a vacation."""
        self.vacation_request["user"] = self.user
        self.vacation_request["uploaded_by"] = self.test_user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"status": "CANCELADA"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data["status"], "CANCELADA")

    def test_vacation_owner_cancel_approved(self):
        """Test the owner cancelling an approved vacation."""
        self.vacation_request["user"] = self.user
        self.vacation_request["uploaded_by"] = self.test_user
        self.vacation_request["manager_approbation"] = True
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"status": "CANCELADA"},
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            str(response.data["non_field_errors"][0]),
            "No puedes cancelar una solicitud que ya ha sido aprobada por tu jefe.",
        )

    def test_vacation_cancel_no_owner(self):
        """Test cancelling a vacation without being the owner."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.test_user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"status": "CANCELADA"},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_vacation_manager_approve(self):
        """Test the manager approving a vacation."""
        self.user.job_position.rank = 5
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"manager_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertTrue(response.data["manager_approbation"])
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.manager_approved_at)

    def test_vacation_manager_reject(self):
        """Test the manager rejecting a vacation."""
        self.user.job_position.rank = 5
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"manager_approbation": False},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertFalse(response.data["manager_approbation"])
        self.assertEqual(response.data["status"], "RECHAZADA")
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.manager_approved_at)

    def test_vacation_manager_approve_no_manager(self):
        """Test the manager approving a vacation without being a manager."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"manager_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_vacation_hr_approve(self):
        """Test HR approving a vacation."""
        self.user.job_position.name = "GERENTE DE GESTION HUMANA"
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        admin = self.create_demo_user_admin()
        self.vacation_request["uploaded_by"] = admin
        self.vacation_request["manager_approbation"] = True
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"hr_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertTrue(response.data["hr_approbation"])
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.hr_approved_at)

    def test_vacation_hr_reject(self):
        """Test HR rejecting a vacation."""
        self.user.job_position.name = "GERENTE DE GESTION HUMANA"
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        self.vacation_request["manager_approbation"] = True
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"hr_approbation": False},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertFalse(response.data["hr_approbation"])
        self.assertEqual(response.data["status"], "RECHAZADA")
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.hr_approved_at)

    def test_vacation_hr_approve_before_manager(self):
        """Test HR approving a vacation before the manager."""
        self.user.job_position.name = "GERENTE DE GESTION HUMANA"
        self.user.job_position.save()
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"hr_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_vacation_hr_approve_no_hr(self):
        """Test HR approving a vacation without being an HR."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"hr_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_vacation_payroll_approve(self):
        """Test payroll approving a vacation."""
        self.user.user_permissions.add(self.permission)
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        self.vacation_request["hr_approbation"] = True
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"payroll_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertTrue(response.data["payroll_approbation"])
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.payroll_approved_at)

    def test_vacation_payroll_reject(self):
        """Test payroll rejecting a vacation."""
        self.user.user_permissions.add(self.permission)
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        self.vacation_request["hr_approbation"] = True
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"payroll_approbation": False},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertFalse(response.data["payroll_approbation"])
        self.assertEqual(response.data["status"], "RECHAZADA")
        vacation_object.refresh_from_db()
        self.assertIsNotNone(vacation_object.payroll_approved_at)

    def test_vacation_payroll_approve_before_hr(self):
        """Test payroll approving a vacation before HR."""
        self.user.user_permissions.add(self.permission)
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"payroll_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_vacation_payroll_approve_no_payroll(self):
        """Test payroll approving a vacation without being in payroll."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"payroll_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    @freeze_time("2024-07-21 10:00:00")
    def test_validate_vacation_request_after_20th(self):
        """Test the validation of a vacation request after the 20th."""
        super().setUp()
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["start_date"] = "2024-08-12"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "Después del día 20 no puedes solicitar vacaciones para el mes siguiente.",
        )

    def test_validate_vacation_request_not_working_day(self):
        """Test the validation of a vacation request on a non-working day."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["start_date"] = "2024-01-01"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes iniciar tus vacaciones un día no laboral.",
        )

    def test_validate_vacation_request_not_working_day_sat(self):
        """Test the validation of a vacation request on a Saturday."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["start_date"] = "2024-05-04"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        # This is fine because if the user doesn't work on Saturdays, they can't start their vacation on a Saturday
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes iniciar tus vacaciones un día no laboral.",
        )

    def test_validate_vacation_request_not_working_day_sat_working(self):
        """Test the validation of a vacation request on a Saturday with working Saturdays."""
        self.vacation_request["mon_to_sat"] = True
        self.vacation_request["start_date"] = "2024-05-04"
        self.vacation_request["end_date"] = "2024-05-06"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_validate_vacation_request_not_working_day_end(self):
        """Test the validation of a vacation request on a non-working day."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["end_date"] = "2024-01-01"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes terminar tus vacaciones un día no laboral.",
        )

    def test_validate_vacation_request_not_working_day_sat_end(self):
        """Test the validation of a vacation request on a Saturday."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["end_date"] = "2024-05-04"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        # This is fine because if the user doesn't work on Saturdays, they can't end their vacation on a Saturday
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes terminar tus vacaciones un día no laboral.",
        )

    def test_validate_vacation_request_not_working_day_sat_working_end(self):
        """Test the validation of a vacation request on a Saturday with working Saturdays."""
        self.vacation_request["mon_to_sat"] = True
        self.vacation_request["start_date"] = "2024-05-03"
        self.vacation_request["end_date"] = "2024-05-04"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_validate_vacation_request_more_than_15_days(self):
        """Test the validation of a vacation request with more than 15 days."""
        self.vacation_request["mon_to_sat"] = False
        self.vacation_request["end_date"] = "2024-01-24"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )
        self.assertEqual(
            response.data["non_field_errors"][0],
            "No puedes solicitar más de 15 días de vacaciones.",
        )

    def test_get_vacation_pdf(self):
        """Test getting the vacation request PDF."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(
            reverse("vacation-get-pdf", kwargs={"pk": vacation_object.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
