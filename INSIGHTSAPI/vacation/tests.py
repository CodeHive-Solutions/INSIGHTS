"""This file contains the tests for the vacation model."""

from services.tests import BaseTestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import VacationRequest
from .serializers import VacationRequestSerializer


class VacationRequestModelTestCase(BaseTestCase):
    """Test module for VacationRequest model."""

    def setUp(self):
        """Create a user and a vacation request."""
        super().setUp()
        pdf = SimpleUploadedFile("test.pdf", b"file_content")
        self.vacation_request = {
            "employee_name": "John Doe",
            "start_date": "2021-01-01",
            "end_date": "2021-01-05",
            "reason": "Vacation",
            "request_file": pdf,
        }

    def test_vacation_create(self):
        """Test creating a vacation endpoint."""
        response = self.client.post(
            reverse("vacation_create"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_vacation_list(self):
        """Test listing all vacations endpoint."""
        response = self.client.get(reverse("vacation_list"))
        vacation_requests = VacationRequest.objects.all()
        serializer = VacationRequestSerializer(vacation_requests, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_vacation_retrieve(self):
        """Test retrieving a vacation endpoint."""
        self.vacation_request["uploaded_by"] = self.user
        vacation_object = VacationRequest.objects.create(**self.vacation_request)
        response = self.client.get(
            reverse("vacation_retrieve", kwargs={"pk": vacation_object.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["employee_name"], self.vacation_request["employee_name"])

    def test_vacation_create_invalid_dates(self):
        """Test creating a vacation with invalid dates."""
        self.vacation_request["start_date"] = "2021-01-06"
        response = self.client.post(
            reverse("vacation_create"),
            self.vacation_request,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["non_field_errors"][0], "La fecha de inicio no puede ser mayor a la fecha de fin.")
