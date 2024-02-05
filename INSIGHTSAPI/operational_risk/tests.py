"""Test for operational risk."""
from django.urls import reverse
from django.contrib.auth.models import Permission
from services.tests import BaseTestCase
from users.models import User
from .models import Events, EventClass, Level, Process, LostType, ProductLine


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
        event_class = EventClass.objects.create(name="FRAUDE INTERNO")
        level = Level.objects.create(name="ALTO")
        process = Process.objects.create(name="Test")
        lost_type = LostType.objects.create(name="Test")
        product = ProductLine.objects.create(name="Test")
        self.data = {
            "start_date": "2020-01-01 00:00:00",
            "end_date": "2020-01-01 00:00:00",
            "discovery_date": "2020-01-01 00:00:00",
            "accounting_date": "2020-01-01 00:00:00",
            "currency": "USD",
            "quantity": 1,
            "recovered_quantity": 1,
            "recovered_quantity_by_insurance": 1,
            "event_class": event_class,
            "reported_by": "Test",
            "critical": False,
            "level": level,
            "plan": "Test",
            "event_title": "Test",
            "public_accounts_affected": "Test",
            "process": process,
            "lost_type": lost_type,
            "description": "Test",
            "product": product,
            "close_date": "2020-01-01",
            "learning": "Test",
            "status": 0,
        }

    def test_create_event(self):
        """Test create event."""
        self.data["event_class"] = self.data["event_class"].name
        self.data["level"] = self.data["level"].name
        self.data["process"] = self.data["process"].name
        self.data["lost_type"] = self.data["lost_type"].name
        self.data["product"] = self.data["product"].name
        response = self.client.post(reverse("events-list"), self.data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["description"], "TEST")

    def test_get_events(self):
        """Test get events."""
        Events.objects.create(**self.data)
        self.data["description"] = "Test 2"
        Events.objects.create(**self.data)
        response = self.client.get(reverse("events-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]["description"], "TEST 2")

    def test_get_event(self):
        """Test get event."""
        event = Events.objects.create(**self.data)
        response = self.client.get(reverse("events-detail", args=[event.id]))
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["description"], "TEST", response.data)
        self.assertEqual(response.data["event_class"], "FRAUDE INTERNO")
        self.assertEqual(response.data["level"], "ALTO")
        self.assertEqual(response.data["process"], "TEST")
        self.assertEqual(response.data["lost_type"], "TEST")
        self.assertEqual(response.data["product"], "TEST")
        self.assertEqual(response.data["status"], False)

    def test_update_event(self):
        """Test update event."""
        event = Events.objects.create(**self.data)
        self.data["event_class"] = self.data["event_class"].name
        self.data["level"] = self.data["level"].name
        self.data["process"] = self.data["process"].name
        self.data["lost_type"] = self.data["lost_type"].name
        self.data["product"] = self.data["product"].name
        self.data["description"] = "Test 3"
        response = self.client.patch(
            reverse("events-detail", args=[event.id]), self.data
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["description"], "TEST 3")

    def test_delete_event(self):
        """Test delete event."""
        event = Events.objects.create(**self.data)
        response = self.client.delete(reverse("events-detail", args=[event.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Events.objects.count(), 0)
