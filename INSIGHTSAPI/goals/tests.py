"""This module contains the tests for the goals app."""
from django.db.models import Q
from django.utils import timezone
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.test import APIClient
from media.goals_templates.goals_delivery import get_template
from .models import Goals, TableInfo
from weasyprint import HTML
from django.conf import settings


class GoalAPITestCase(APITestCase):
    """Test the Goal API."""

    def setUp(self):
        """Set up the test client."""
        self.client = APIClient()

    def test_serializer(self):
        """Test the Goal serializer."""
        self.test_claro_upload()
        response = self.client.get(reverse("goal-list"))
        self.assertEqual(response.status_code, 200)

    def test_metas_upload(self, called=False):
        """Test the upload-excel view."""
        # if called:
        # Create a SimpleUploadedFile instance from the Excel file
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Entrega de metas-ENERO-2018.xlsx"
        with open(file_path, "rb") as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile(
            "Entrega de metas-ENERO-2018.xlsx",
            file_data,
            content_type="application/vnd.ms-excel",
        )
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse("goal-list"), {"file": excel_file})
        # Assert the response status code and perform additional assertions for the response data
        number_goals = Goals.objects.all().count()
        # print(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(number_goals > 0)

    def test_execution_upload(self, called=False):
        """Test the upload-excel view."""
        if called:
            # Create a SimpleUploadedFile instance from the Excel file
            file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Ejecución de metas-enerO-2022.xlsx"
            with open(file_path, "rb") as file_obj:
                file_data = file_obj.read()
            excel_file = SimpleUploadedFile(
                "Ejecución de metas-enerO-2022.xlsx",
                file_data,
                content_type="application/vnd.ms-excel",
            )
            # Send the POST request to the upload-excel URL with the Excel file data
            response = self.client.post(reverse("goal-list"), {"file": excel_file})
            # Assert the response status code and perform additional assertions for the response data
            self.assertEqual(response.status_code, 201)
            count = Goals.objects.exclude(total="").count()
            self.assertTrue(count > 0)

    def test_borrado_accepted(self):
        """Test the upload-excel view."""
        # Sube registros que después los borra
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Entrega de metas-ENERO-2018.xlsx"
        with open(file_path, "rb") as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile(
            "Entrega de metas-ENERO-2018.xlsx",
            file_data,
            content_type="application/vnd.ms-excel",
        )
        # Invoke the test_metas_upload() method to have data in the database and some goals like accepted
        self.test_metas_upload(called=True)
        # See if there are goals created
        number_goals = Goals.objects.all().count()
        self.assertTrue(number_goals > 0)
        # put accepted to True and accepted_at to now() to Goals
        Goals.objects.all().update(accepted=True, accepted_at=timezone.now())
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse("goal-list"), {"file": excel_file})
        self.assertEqual(response.status_code, 201)
        # See if the accepted goals were deleted
        first_goal = Goals.objects.exclude(accepted_at=None).first()
        self.assertIsNone(first_goal)
        count = Goals.objects.exclude(Q(accepted__isnull=True) | Q(accepted="")).count()
        count_at = Goals.objects.exclude(accepted_at=None).count()
        self.assertEqual((count, count_at), (0, 0))
        # Do the same verifications but with execution
        Goals.objects.all().update(
            accepted_execution=True, accepted_execution_at=timezone.now()
        )
        self.test_execution_upload(called=True)
        count_execution = Goals.objects.exclude(
            Q(accepted__isnull=True) | Q(accepted="")
        ).count()
        first_goal = Goals.objects.exclude(accepted_execution_at=None).first()
        self.assertIsNone(first_goal)
        count_at_execution = Goals.objects.exclude(accepted_execution_at=None).count()
        self.assertEqual((count_execution, count_at_execution), (0, 0))

    def test_claro_upload(self):
        """Test the upload-excel view."""
        # Create a SimpleUploadedFile instance from the Excel file
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Entrega de metas ejemplo Claro-ENERO-2028.xlsx"
        with open(file_path, "rb") as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile(
            "Entrega de metas ejemplo Claro-ENERO-2028.xlsx",
            file_data,
            content_type="application/vnd.ms-excel",
        )
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse("goal-list"), {"file": excel_file})
        # Assert the response status code and perform additional assertions for the response data
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Goals.objects.all().count() > 0)
        self.assertTrue(TableInfo.objects.all().count() > 0)
        self.assertTrue(Goals.objects.all().exclude(table_goal=None).count() > 0)

    def test_get_history(self):
        """Test the get-history view."""
        self.test_claro_upload()
        self.test_execution_upload(called=True)
        # Check with a month that has no goals
        response = self.client.get("/goals/?date=DICIembre-2028&column=delivery")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(len(response.data) > 0)  # type: ignore
        # Check with a month that has goals
        response = self.client.get("/goals/?date=ENERO-2028&column=delivery")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 110)  # type: ignore
        self.assertIn("ENERO-2028", response.data[0].get("goal_date"))  # type: ignore
        # Check with a month that has execution
        response = self.client.get("/goals/?date=ENERO-2022&column=execution")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 338)  # type: ignore
        # Upload a file to test if the same month distinct between delivery and execution
        file_path = "/var/www/INSIGHTS/INSIGHTSAPI/utils/excels/Entrega de metas ejemplo Claro-ENERO-2028.xlsx"
        with open(file_path, "rb") as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile(
            "Entrega de metas ejemplo Claro-ENERO-2022.xlsx",
            file_data,
            content_type="application/vnd.ms-excel",
        )
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse("goal-list"), {"file": excel_file})
        self.assertEqual(response.status_code, 201)
        # Check with a month that has twice
        response = self.client.get("/goals/?date=ENERO-2022&column=delivery")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 110)  # type: ignore
        self.assertIn("ENERO-2022", response.data[0].get("goal_date"))  # type: ignore

    def test_get_one_history(self):
        """Test the get-one-history view."""
        self.test_claro_upload()
        self.test_execution_upload(called=True)
        # Check with a month that has goals
        response = self.client.get("/goals/1016080155/?date=ENERO-2028&column=delivery")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["cedula"], 1016080155)  # type: ignore
        self.assertIn("ENERO-2028", response.data.get("goal_date"))  # type: ignore
        self.assertEqual(len(response.data), 28)  # type: ignore
        # Check with a month that has execution
        response = self.client.get(
            "/goals/1192792468/?date=ENERO-2022&column=execution"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["cedula"], 1192792468)  # type: ignore
        self.assertEqual(len(response.data), 28)  # type: ignore
        self.assertIn("ENERO-2022", response.data.get("execution_date"))  # type: ignore

    def test_update_goal(self):
        """Test the update-goal view."""
        self.test_claro_upload()
        # Get the first goal from the database
        goal = Goals.objects.create(
            cedula="1000065648",
            name="Heibert",
            campaign_goal="Base Test Goal",
            result="100",
            evaluation="100",
            quality="100",
            clean_desk="100",
            total="100",
            job_title_goal="Developer",
            last_update=timezone.now(),
            criteria_goal="100",
            quantity_goal="100",
            goal_date="ENERO-2022",
            execution_date="FEBRERO-2022",
        )
        # Prepare the request data
        payload = {
            "result": "100",
            "evaluation": "100",
            "quality": "100",
            "clean_desk": "100",
            "total": "100",
            "job_title_goal": "Developer",
            "criteria_goal": "100",
            "quantity_goal": "100",
            "accepted": True,
        }
        # Send a PATCH request to the update-goal view
        response = self.client.patch(
            reverse("goal-detail", args=[goal.cedula]), data=payload
        )
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        # Assert that the goal was updated with the new data
        self.assertEqual(response.data["message"], "La meta fue aceptada.", response.data)

    # def test_accept_goal(self):
    #     """Test the accept-goal view."""
    #     self.test_claro_upload()
    #     goal = Goals.objects.first()
    #     payload = {
    #         "accepted": True,
    #     }
    #     response = self.client.patch(
    #         reverse("goal-detail", args=[goal.cedula]), data=payload
    #     )
    #     # Assert the response status code and content
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
    #     self.assertTrue(response.data["accepted"])


# class SendEmailTestCase(APITestCase):
#     """Test the send-email function of the goals view."""

#     databases = ["staffnet", "default"]  # type: ignore

#     def setUp(self):
#         self.client = APIClient()
#         self.url = reverse("goal-send-email")
#         self.heibert = Goals.objects.create(
#             cedula="1000065648",
#             name="Heibert",
#             campaign_goal="Base Test Goal",
#             result="100",
#             evaluation="100",
#             quality="100",
#             clean_desk="100",
#             total="100",
#             job_title_goal="Developer",
#             last_update=timezone.now(),
#             criteria_goal="100",
#             quantity_goal="100",
#         )

    # def test_pdf_create(self):
    #     """Test the pdf creation"""
    #     template = get_template("Jorge", "1000065648", "Testing", "fala", 11, "10")
    #     media = settings.MEDIA_ROOT
    #     with open(media / "test.html", "wb") as f:
    #         f.write(template.encode("utf-8"))

    #     with open(media / "test.html", "rb") as html_file:
    #         html_content = html_file.read().decode("utf-8")

    #     HTML(string=html_content).write_pdf(settings.MEDIA_ROOT / "test.pdf")

    # def test_send_email_success(self):
    #     """Test the send-email view."""
    #     # Prepare the necessary data for the request
    #     payload = {
    #         "cedula": "1000065648",
    #     }
    #     response = self.client.post(self.url, data=payload)
    #     # Assert the response status code and content
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     email = response.data["email"]
    #     self.assertIsNotNone(email)

    # def test_send_email_missing_data(self):
    #     """Test the send-email view with missing data."""
    #     # Prepare the request with missing data
    #     payload = {
    #         "pdf": "base64_encoded_pdf_data",
    #         # Missing 'cedula' and 'delivery_type'
    #     }
    #     # Send a POST request to the view
    #     response = self.client.post(self.url, data=payload)
    #     # Assert the response status code and content
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     data = response.json()
    #     self.assertIn("Error", data)
    #     # Assert that the email was not sent and handle the specific error case

    # def test_send_email_invalid_cedula(self):
    #     """Test the send-email view with an invalid cedula value."""
    #     # Prepare the request with an invalid cedula value
    #     payload = {
    #         "pdf": "base64_encoded_pdf_data",
    #         "cedula": "999999999999",  # Provide a non-existing cedula value
    #         "delivery_type": "Some Delivery Type",
    #     }
    #     # Send a POST request to the view
    #     response = self.client.post(self.url, data=payload)
    #     # Assert the response status code and content
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
