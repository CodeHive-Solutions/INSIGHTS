"""Test for operational risk."""
from django.urls import reverse
from django.contrib.auth.models import Permission
from services.tests import BaseTestCase
from users.models import User
from .models import Events


class EventsTest(BaseTestCase):
    """Test for operational risk."""

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.user = User.objects.get(username="staffnet")
        self.user.user_permissions.add(Permission.objects.get(codename="view_events"))
        self.user.user_permissions.add(Permission.objects.get(codename="add_events"))
        self.user.user_permissions.add(Permission.objects.get(codename="change_events"))
        self.user.user_permissions.add(Permission.objects.get(codename="delete_events"))
        self.data = {
            "start_date": "2020-01-01",
            "end_date": "2020-01-01",
            "discovery_date": "2020-01-01",
            "accounting_date": "2020-01-01",
            "currency": "USD",
            "quantity": 1,
            "recovered_quantity": 1,
            "recovered_quantity_by_insurance": 1,
            "event_class": "FRAUDE INTERNO",
            "reported_by": "Test",
            "classification": "CRITICO",
            "level": "ALTO",
            "plan": "Test",
            "event": "Test",
            "public_accounts_affected": "Test",
            "process": "Test",
            "lost_type": "Test",
            "description": "Test",
            "product_line": "Test",
            "date_of_closure": "2020-01-01",
            "learning": "Test",
            "status": "CERRADO",
        }

    def test_create_event(self):
        """Test create event."""
        response = self.client.post(reverse("events-list"), self.data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["description"], "Test")

    def test_get_events(self):
        """Test get events."""
        Events.objects.create(**self.data)
        self.data["description"] = "Test 2"
        Events.objects.create(**self.data)
        response = self.client.get(reverse("events-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]["description"], "Test 2")

    def test_get_event(self):
        """Test get event."""
        event = Events.objects.create(**self.data)
        response = self.client.get(reverse("events-detail", args=[event.id]))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["description"], "Test", response.data)

    def test_update_event(self):
        """Test update event."""
        event = Events.objects.create(**self.data)
        self.data["description"] = "Test 3"
        response = self.client.patch(
            reverse("events-detail", args=[event.id]), self.data
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["description"], "Test 3")

    def test_delete_event(self):
        """Test delete event."""
        event = Events.objects.create(**self.data)
        response = self.client.delete(reverse("events-detail", args=[event.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Events.objects.count(), 0)
