from django.urls import reverse
from rest_framework import status
from services.tests import BaseTestCase
from .models import Notification


class NotificationTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.notification = Notification.objects.create(
            user=self.user, message="Test notification"
        )

    def test_list_notifications(self):
        url = reverse("notifications-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["message"], "Test notification")

    def test_mark_notification_as_read(self):
        url = reverse("notifications-patch", args=[self.notification.id])
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_nonexistent_notification_as_read(self):
        url = reverse("notifications-patch", args=[999])  # non-existent notification ID
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "Notification not found")

    def test_list_notifications_unauthenticated(self):
        self.logout()
        url = reverse("notifications-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mark_notification_as_read_unauthenticated(self):
        self.logout()
        url = reverse("notifications-patch", args=[self.notification.id])
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
