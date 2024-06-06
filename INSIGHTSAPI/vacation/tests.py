"""This file contains the tests for the vacation model."""

from services.tests import BaseTestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from users.models import User
from .models import VacationRequest
from .serializers import VacationRequestSerializer


class VacationRequestModelTestCase(BaseTestCase):
    """Test module for VacationRequest model."""

    def setUp(self):
        """Create a user and a vacation request."""
        super().setUp()
        test_user = self.create_demo_user()
        self.user.job_position.rank = 7
        self.user.job_position.save()
        pdf = SimpleUploadedFile("test.pdf", b"file_content")
        self.vacation_request = {
            "user": test_user.pk,
            "start_date": "2021-01-01",
            "end_date": "2021-01-05",
            "request_file": pdf,
        }

    def test_vacation_create(self):
        """Test creating a vacation endpoint."""
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_vacation_list(self):
        """Test listing all vacations endpoint."""
        response = self.client.get(reverse("vacation-list"))
        vacation_requests = VacationRequest.objects.all()
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_vacation_retrieve(self):
        """Test retrieving a vacation endpoint."""
        self.vacation_request["user"] = User.objects.get(username="demo")
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(
            reverse("vacation-detail", kwargs={"pk": vacation_object.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.vacation_request["user"].get_full_name())
        self.assertEqual(response.data["start_date"], self.vacation_request["start_date"])
        self.assertEqual(response.data["end_date"], self.vacation_request["end_date"])

    def test_vacation_create_invalid_dates(self):
        """Test creating a vacation with invalid dates."""
        self.vacation_request["start_date"] = "2021-01-06"
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["non_field_errors"][0], "La fecha de inicio no puede ser mayor a la fecha de fin.")

    def test_vacation_create_invalid_rank(self):
        """Test creating a vacation with invalid rank."""
        demo_user = User.objects.get(username="demo")
        demo_user.job_position.rank = 1
        demo_user.job_position.save()
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["non_field_errors"][0], "No puedes crear una solicitud para este usuario.")

    def test_vacation_create_invalid_user(self):
        """Test creating a vacation for the same user."""
        self.vacation_request["user"] = self.user
        response = self.client.post(
            reverse("vacation-list"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print(response.data)
        self.assertEqual(response.data["non_field_errors"][0], "No puedes subir solicitudes para ti mismo.")