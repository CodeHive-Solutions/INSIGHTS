from services.tests import BaseTestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Banner


# Create your tests here.
class BannerTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.banner = Banner.objects.create(
            title="Test Banner",
            link="https://www.google.com",
            image="carousel_images/banners/test.jpg",
            order=1,
        )
        with open("static/test/Logo_cyc.png", "rb") as image_data:
            self.image = SimpleUploadedFile(
                "test3.jpg", image_data.read(), content_type="image/jpg"
            )

    def test_get_banner(self):
        Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image="carousel_images/banners/test2.jpg",
            order=2,
        )
        response = self.client.get(reverse("banners-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "Test Banner")
        self.assertEqual(response.data[0]["link"], "https://www.google.com")
        self.assertEqual(response.data[0]["active"], True)

    def test_get_only_active_banner(self):
        Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            active=False,
            image="carousel_images/banners/test2.jpg",
            order=2,
        )
        response = self.client.get(reverse("banners-list"))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 1)

    def test_create_banner(self):
        data = {
            "title": "Test Banner 3",
            "link": "https://www.google.com",
            "image": self.image,
            "order": 2,
        }
        print("Create")
        response = self.client.post(reverse("banners-list"), data)
        print("aqui",response.data.get("active"))
        self.assertEqual(response.status_code, 201, response.data)
        get_banners = self.client.get(reverse("banners-list"))
        self.assertEqual(len(get_banners.data), 2)

    def test_delete_banner(self):
        response = self.client.delete(reverse("banners-detail", args=[self.banner.id]))
        self.assertEqual(response.status_code, 204, response.data)
        self.assertEqual(Banner.objects.count(), 1)
        self.assertEqual(Banner.objects.filter(active=True).count(), 0)

    def test_update_banner_order(self):
        banner2 = Banner.objects.create(
            title="Test Banner 2",
            link="https://www.google.com",
            image="carousel_images/banners/test2.jpg",
            order=2,
        )
        response = self.client.post(
            reverse("banners-list"),
            {
                "title": "Test Banner 3",
                "link": "https://www.google.com",
                "image": self.image,
                "order": 2,
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Banner.objects.count(), 3)
        self.assertEqual(Banner.objects.get(id=banner2.id).order, 3)
