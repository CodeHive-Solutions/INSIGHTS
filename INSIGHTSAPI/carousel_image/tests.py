from services.tests import BaseTestCase
from django.urls import reverse
from .models import Banner


# Create your tests here.
class BannerTestCase(BaseTestCase):
    def setUp(self):
        self.banner = Banner.objects.create(
            title="Test Banner",
            link="https://www.google.com",
            active=True,
            image="carousel_images/banners/test.jpg",
        )

    def test_get_banner(self):
        banner_2 = self.banner
        response = self.client.get(reverse("banners-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "Test Banner")
        self.assertEqual(response.data[0]["link"], "https://www.google.com")
        self.assertEqual(response.data[0]["active"], True)
        self.assertEqual(response.data[0]["image"], "carousel_images/banners/test.jpg")

    def test_delete_banner(self):
        response = self.client.delete(reverse("banners-detail", args=[self.banner.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Banner.objects.count(), 1)
        self.assertEqual(Banner.objects.filter(active=True).count(), 0)