"""This file contains the tests for the vacation model."""

from services.tests import BaseTestCase
from rest_framework import status
from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.db.models import Q
from .models import VacationRequest
from .serializers import VacationRequestSerializer


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
            "start_date": "2021-01-01",
            "end_date": "2021-01-05",
            "request_file": pdf,
        }

    def test_vacation_create(self):
        """Test creating a vacation endpoint."""
        self.vacation_request["hr_approbation"] = (
            True  # This is a check for the serializer
        )
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["hr_approbation"], None)

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
        self.assertEqual(response.data, serializer.data, (response.data, serializer.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
        print(self.user.area)
        print(self.test_user.area)
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(reverse("vacation-list"))
        vacation_requests = VacationRequest.objects.filter(
            Q(uploaded_by__job_position__rank__lt=self.user.job_position.rank) | Q(user=self.user)
        )
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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

    def test_vacation_create_invalid_dates(self):
        """Test creating a vacation with invalid dates."""
        self.vacation_request["start_date"] = "2021-01-06"
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

    def test_vacation_create_invalid_user(self):
        """Test creating a vacation for the same user."""
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

    def test_vacation_owner_cancel(self):
        """Test the owner cancelling a vacation."""
        self.vacation_request["user"] = self.test_user
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"status": "CANCELADA"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data["status"], "CANCELADA")

    def test_vacation_owner_cancel_no_owner(self):
        """Test the owner cancelling a vacation without being the owner."""
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

        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"hr_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertTrue(response.data["hr_approbation"])

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
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.patch(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk}),
            {"payroll_approbation": True},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertTrue(response.data["payroll_approbation"])

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
