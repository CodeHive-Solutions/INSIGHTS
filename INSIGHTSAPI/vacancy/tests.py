"""Test for vacancy."""

from services.tests import BaseTestCase
from users.models import User
from django.test import override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import Permission
from .models import Vacancy, Reference


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
class VacancyTest(BaseTestCase):
    """Test for vacancy email."""

    databases = ["default", "staffnet"]

    def setUp(self, user=None):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(name="Can add vacancy")
        self.user.user_permissions.add(permission)
        permission_update = Permission.objects.get(name="Can change vacancy")
        self.user.user_permissions.add(permission_update)
        with open("static/vacancy/asesor-vacante.png", "rb") as image_data:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image_data.read(), content_type="image/png"
            )
        self.data = {
            "name": "Auxiliar de servicios generales TEST",
            "image": image,
        }

    def test_create_vacancy(self):
        """Test create vacancy."""
        # Upload image
        response = self.client.post(
            reverse("vacancy-list"),
            {
                "name": "Auxiliar de servicios generales TEST",
                "image": self.data["image"],
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Vacancy.objects.count(), 1)
        vacancy = Vacancy.objects.first()
        self.assertEqual(vacancy.name, "Auxiliar de servicios generales TEST")
        self.assertTrue(vacancy.is_active)

    def test_get_vacancies(self):
        """Test get vacancies."""
        Vacancy.objects.create(**self.data)
        self.data["is_active"] = False
        Vacancy.objects.create(**self.data)
        response = self.client.get(reverse("vacancy-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 1)

    def test_get_vacancy(self):
        """Test get vacancy."""
        vacancy = Vacancy.objects.create(**self.data)
        response = self.client.get(reverse("vacancy-detail", args=[vacancy.id]))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Auxiliar de servicios generales TEST")

    def test_create_vacancy_without_permission(self):
        """Test create vacancy without permission."""
        self.user.user_permissions.clear()
        response = self.client.post(
            reverse("vacancy-list"),
            {
                "name": "Auxiliar de servicios generales TEST",
                "image": self.data["image"],
            },
        )
        self.assertEqual(response.status_code, 403, response.data)

    def test_update_vacancy_active(self):
        """Test update vacancy."""
        vacancy = Vacancy.objects.create(**self.data)
        response = self.client.patch(
            reverse("vacancy-detail", args=[vacancy.id]), {"is_active": False}
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["is_active"], False)

    def test_update_vacancy_without_permission(self):
        """Test update vacancy without permission."""
        self.user.user_permissions.clear()
        vacancy = Vacancy.objects.create(**self.data)
        response = self.client.patch(
            reverse("vacancy-detail", args=[vacancy.id]),
            {"name": "Auxiliar de servicios generales"},
        )
        self.assertEqual(response.status_code, 403, response.data)

    def test_update_other_column_than_active(self):
        """Test update other column than active."""
        vacancy = Vacancy.objects.create(**self.data)
        response = self.client.patch(
            reverse("vacancy-detail", args=[vacancy.id]),
            {"name": "Auxiliar de servicios generales"},
        )
        self.assertEqual(response.status_code, 400, response.data)
        # Now try with a put request
        response = self.client.put(
            reverse("vacancy-detail", args=[vacancy.id]),
            {
                "name": "Auxiliar de servicios generales",
                "image": self.data["image"],
                "is_active": False,
            },
        )
        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data, {"error": "No se puede modificar la vacante"})

    def test_delete_vacancy(self):
        """Test delete vacancy."""
        vacancy = Vacancy.objects.create(**self.data)
        response = self.client.delete(reverse("vacancy-detail", args=[vacancy.id]))
        self.assertEqual(response.status_code, 405, response.data)


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
class ReferenceTest(BaseTestCase):
    """Test for reference."""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        permission = Permission.objects.get(name="Can add reference")
        self.user.user_permissions.add(permission)
        permission_get = Permission.objects.get(name="Can view reference")
        self.user.user_permissions.add(permission_get)
        with open("static/vacancy/asesor-vacante.png", "rb") as image_data:
            image = SimpleUploadedFile(
                "asesor-vacante.png", image_data.read(), content_type="image/png"
            )
            vacancy = Vacancy.objects.create(
                name="Auxiliar de servicios generales TEST", image=image
            )
        self.data_api = {
            "name": "Juan Test",
            "phone_number": "1234567890",
            "vacancy": vacancy.pk,
        }
        self.data_model = {
            "made_by": self.user,
            "name": "Juan Test",
            "phone_number": "1234567890",
            "vacancy": vacancy,
        }

    def test_create_reference(self):
        """Test create reference."""
        response = self.client.post(
            reverse("reference-list"),
            self.data_api,
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_get_references(self):
        """Test get references."""
        Reference.objects.create(**self.data_model)
        response = self.client.get(reverse("reference-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 1)

    def test_get_reference(self):
        """Test get reference."""
        reference = Reference.objects.create(**self.data_model)
        response = self.client.get(reverse("reference-detail", args=[reference.id]))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Juan Test")
        self.assertEqual(response.data["phone_number"], "1234567890")
        self.assertEqual(response.data["vacancy"], 2)

    def test_get_reference_without_permission(self):
        """Test get reference without permission."""
        self.user.user_permissions.clear()
        reference = Reference.objects.create(**self.data_model)
        response = self.client.get(reverse("reference-detail", args=[reference.id]))
        self.assertEqual(response.status_code, 403, response.data)

    def test_re_apply_reference(self):
        """Test re apply reference."""
        Reference.objects.create(**self.data_model)
        response = self.client.post(
            reverse("reference-list"),
            {
                "name": "Juan Test",
                "phone_number": "1234567890",
                "vacancy": self.data_api["vacancy"],
            },
        )
        self.assertEqual(response.status_code, 400, response.data)
        self.assertIn("non_field_errors", response.data)
        self.assertIn(
            "Ya referenciaste a esta persona.", response.data["non_field_errors"]
        )


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
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
                name="Auxiliar de servicios generales TEST",
                image=image,
            )
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
                "message": 'Correo enviado correctamente a "'
                + str(self.user.email)
                + '"',
            },
        )
