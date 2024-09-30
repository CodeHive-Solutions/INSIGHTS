from PIL import Image
from services.tests import BaseTestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import Permission
from django.test import override_settings
from django.conf import settings
from .models import Banner


# Create your tests here.
# @override_settings(MEDIA_ROOT=settings.BASE_DIR / "carousel_image" / "test")
@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.InMemoryStorage")
class BannerTestCase(BaseTestCase):

    def get_test_image(self, name="Test_image.png"):
        """Helper method to return a fresh SimpleUploadedFile object."""
        with open(settings.BASE_DIR / "static" / "test" / name, "rb") as image_data:
            return SimpleUploadedFile(
                "test.jpg", image_data.read(), content_type="image/jpg"
            )

    def setUp(self):
        super().setUp()
        self.banner = Banner.objects.create(
            title="Test Banner",
            link="https://www.google.com",
            image=self.get_test_image(),
            order=1,
        )
        self.user.user_permissions.add(Permission.objects.get(codename="add_banner"))

    def test_get_banner(self):
        Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image=self.get_test_image("Test_image2.png"),
            order=2,
        )
        response = self.client.get(reverse("banners-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "Test Banner")
        self.assertEqual(response.data[0]["link"], "https://www.google.com")

    def test_create_banner(self):
        data = {
            "title": "Test Banner 3",
            "link": "https://www.google.com",
            "image": self.get_test_image(),
            "order": 2,
        }
        response = self.client.post(reverse("banners-list"), data)
        self.assertEqual(response.status_code, 201, response.data)
        get_banners = self.client.get(reverse("banners-list"))
        self.assertEqual(len(get_banners.data), 2)

    def test_image_size(self):
        data = {
            "title": "Test Banner 3",
            "link": "https://www.google.com",
            "image": self.get_test_image("Test_banner.jpg"),
            "order": 2,
        }
        response = self.client.post(reverse("banners-list"), data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 2)
        print(
            "height",
            Banner.objects.get(id=response.data["id"]).image.height,
            "width",
            Banner.objects.get(id=response.data["id"]).image.width,
        )
        self.assertEqual(Banner.objects.get(id=response.data["id"]).image.width, 1280)
        self.assertEqual(Banner.objects.get(id=response.data["id"]).image.height, 720)
        try:
            img = Image.open(Banner.objects.get(id=response.data["id"]).image)
            img.verify()
        except Exception as e:
            self.fail("Image is not valid")

    def test_convert_to_webp(self):
        data = {
            "title": "Test Banner 3",
            "link": "https://www.google.com",
            "image": self.get_test_image("Test_banner.jpg"),
            "order": 2,
        }
        response = self.client.post(reverse("banners-list"), data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 2)
        self.assertTrue(
            Banner.objects.get(id=response.data["id"]).image.name.endswith(".webp")
        )
        try:
            img = Image.open(Banner.objects.get(id=response.data["id"]).image)
            img.verify()
        except Exception as e:
            self.fail("Image is not valid")

    def test_update_banner_order(self):
        self.user.user_permissions.add(Permission.objects.get(codename="change_banner"))
        banner2 = Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image=self.get_test_image("Test_image2.png"),
            order=2,
        )
        response = self.client.post(
            reverse("banners-list"),
            {
                "title": "Test Banner 3",
                "link": "https://www.google.com",
                "image": self.get_test_image(),
                "order": 2,
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 3)
        self.assertEqual(Banner.objects.get(id=banner2.id).order, 3)

    def test_banner_order_penultimate(self):
        banner2 = Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image=self.get_test_image("Test_image2.png"),
            order=2,
        )
        response = self.client.post(
            reverse("banners-list"),
            {
                "title": "Test Banner 3",
                "link": "https://www.google.com",
                "image": self.get_test_image(),
                "order": 2,
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 3)
        self.assertEqual(Banner.objects.get(id=banner2.id).order, 3)
        self.assertEqual(Banner.objects.get(id=response.data["id"]).order, 2)

    def test_banner_order_last(self):
        banner2 = Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image=self.get_test_image("Test_image2.png"),
            order=2,
        )
        response = self.client.post(
            reverse("banners-list"),
            {
                "title": "Test Banner 3",
                "link": "https://www.google.com",
                "image": self.get_test_image(),
                "order": 3,
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 3)
        self.assertEqual(Banner.objects.get(id=banner2.id).order, 2)

    def test_delete_banner(self):
        create_banner = Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image=self.get_test_image("Test_image2.png"),
            order=2,
        )
        self.user.user_permissions.add(Permission.objects.get(codename="delete_banner"))
        response = self.client.delete(reverse("banners-detail", args=[self.banner.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Banner.objects.count(), 1)
        self.assertEqual(Banner.objects.get(id=create_banner.id).order, 1)
