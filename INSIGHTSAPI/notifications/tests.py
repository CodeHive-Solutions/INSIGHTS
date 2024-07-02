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
        demo_user = self.create_demo_user()
        Notification.objects.create(user=demo_user, message="Another notification")
        url = reverse("notifications-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["message"], "Test notification")

    def test_mark_notification_as_read(self):
        url = reverse("notifications-detail", args=[self.notification.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_notification_as_unread(self):
        self.notification.read = True
        self.notification.save()
        url = reverse("notifications-detail", args=[self.notification.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.notification.refresh_from_db()
        self.assertFalse(self.notification.read)

    def test_mark_nonexistent_notification_as_read(self):
        url = reverse("notifications-detail", args=[999])  # non-existent notification ID
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_notifications_unauthenticated(self):
        self.logout()
        url = reverse("notifications-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mark_notification_as_read_unauthenticated(self):
        self.logout()
        url = reverse("notifications-detail", args=[self.notification.id])
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_max_notifications(self):
        for i in range(13):
            Notification.objects.create(user=self.user, message=f"Notification {i}")
        url = reverse("notifications-list")
        response = self.client.get(url)
        self.assertEqual(len(response.data), 10)
        self.assertEqual(response.data[0]["message"], "Notification 12")
        self.assertEqual(response.data[9]["message"], "Notification 3")
