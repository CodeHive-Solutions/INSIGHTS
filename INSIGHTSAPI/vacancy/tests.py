"""Test for vacancy."""
from services.tests import BaseTestCase
from django.urls import reverse
import base64


class VacancyEmailTest(BaseTestCase):
    """Test for vacancy email."""

    databases = ["default", "staffnet"]

    def setUp(self, user=None):
        """Set up the test case."""
        super().setUp(user="heibert.mogollon")

    def test_apply_vacancy(self):
        """Test send email vacancy."""
        with open("static/services/asesor-vacante.png", "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode("utf-8")
            response = self.client.post(
                reverse("send_email_vacancy"),
                {
                    "vacancy": "Operador de Call Center TEST",
                    "image": image_data,
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
        with open("static/services/asesor-vacante.png", "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode("utf-8")
            response = self.client.post(
                reverse("send_email_vacancy"),
                {
                    "vacancy": "Auxiliar de servicios generales TEST",
                    "image": image_data,
                    # "email": "test@cyc-bpo.com",
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
