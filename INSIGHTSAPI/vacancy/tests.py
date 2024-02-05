"""Test for vacancy."""
import os
import tempfile
import shutil
from services.tests import BaseTestCase
from users.models import User
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import Permission
from django.conf import settings
from .models import Vacancy, Reference


class VacancyTest(BaseTestCase):
    """Test for vacancy email."""

    databases = ["default", "staffnet"]

    def setUp(self, user=None):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(name="Can add vacancy")
        self.user.user_permissions.add(permission)
        temp_folder = tempfile.mkdtemp()
        self.media_directory = temp_folder
        settings.MEDIA_ROOT = self.media_directory

    def test_create_vacancy(self):
        """Test create vacancy."""
        # Upload image
        with open("static/vacancy/asesor-vacante.png", "rb") as image_data:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image_data.read(), content_type="image/png"
            )
            response = self.client.post(
                reverse("vacancy-list"),
                {
                    "vacancy_name": "Auxiliar de servicios generales TEST",
                    "image": image,
                },
            )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Vacancy.objects.count(), 1)

    def tearDown(self):
        super().tearDown()
        if self.media_directory.startswith("/tmp"):
            shutil.rmtree(self.media_directory)
            # pass
        else:
            print(f"Not removing {self.media_directory}")


class ReferenceTest(BaseTestCase):
    """Test for reference."""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(name="Can add reference")
        self.user.user_permissions.add(permission)

    def test_create_reference(self):
        """Test create reference."""
        with open("static/vacancy/asesor-vacante.png", "rb") as image_data:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image_data.read(), content_type="image/png"
            )
            vacancy = Vacancy.objects.create(
                vacancy_name="Auxiliar de servicios generales TEST", image=image
            )
        response = self.client.post(
            reverse("reference-list"),
            {
                "name": "Juan Test",
                "phone_number": "1234567890",
                "vacancy": vacancy.id,
            },
        )
        self.assertEqual(response.status_code, 201, response.data)


class VacancyApplyTest(BaseTestCase):
    """Test for vacancy apply."""

    databases = ["default", "staffnet"]

    def test_vacancy_apply(self):
        """Test vacancy apply."""
        with open("static/vacancy/asesor-vacante.png", "rb") as image_data:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image_data.read(), content_type="image/png"
            )
            vacancy = Vacancy.objects.create(
                vacancy_name="Auxiliar de servicios generales TEST",
                image=image,
            )
        user = User.objects.get(username="staffnet")
        user.cedula = "1000065648"
        user.save()
        response = self.client.post(
            reverse("vacancy_apply"),
            {
                "vacancy": vacancy.id,
            },
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(
            response.data,
            {
                "message": 'Correo enviado correctamente a "heibert.mogollon@cyc-bpo.com"'
            },
        )
