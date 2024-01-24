"""Test for vacancy."""
from services.tests import BaseTestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Vacancy, Reference


class VacancyEmailTest(BaseTestCase):
    """Test for vacancy email."""

    databases = ["default", "staffnet"]

    def setUp(self, user=None):
        """Set up the test case."""
        super().setUp()

    def test_apply_vacancy(self):
        """Test send email vacancy."""
        # Upload image
        with open("static/vacancy/asesor-vacante.png", "rb") as image:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image.read(), content_type="image/png"
            )
            response = self.client.post(
                reverse("send_email_vacancy"),
                {
                    "vacancy_name": "Auxiliar de servicios generales TEST",
                    "image": image,
                },
            )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(
            response.data,
            {
                "message": 'Correo enviado correctamente a "heibert.mogollon@cyc-bpo.com"'
            },
        )

    def test_suggest_vacancy(self):
        """Test send email vacancy."""
        with open("static/vacancy/asesor-vacante.png", "rb") as image:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image.read(), content_type="image/png"
            )
            response = self.client.post(
                reverse("send_email_vacancy"),
                {
                    "vacancy_name": "Auxiliar de servicios generales TEST",
                    "image": image,
                    "email": "heibert.mogollon@cyc-bpo.com",
                },
            )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(
            response.data,
            # {"message": "Correo enviado correctamente a test@cyc-bpo.com"},
            {
                "message": 'Correo enviado correctamente a "heibert.mogollon@cyc-bpo.com"'
            },
        )
        self.assertEqual(Vacancy.objects.count(), 1)
        print(Vacancy.objects.first())


class ReferenceTest(BaseTestCase):
    """Test for reference."""

    databases = ["default", "staffnet"]

    def setUp(self, user=None):
        """Set up the test case."""
        super().setUp()

    def test_create_reference(self):
        """Test create reference."""
        response = self.client.post(
            reverse("reference-list"),
            {"name": "Test", "email": "heibert.mogollon@cyc-bpo.com"},
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(
            response.data,
            # {"message": "Correo enviado correctamente a test@cyc-bpo.com"},
            {
                "message": 'Correo enviado correctamente a "heibert.mogollon@cyc-bpo.com"'
            },
        )
