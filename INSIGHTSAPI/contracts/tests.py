"""This module defines the tests for the contracts app."""

from services.tests import BaseTestCase
from users.models import User
from django.contrib.auth.models import Permission
from django.test import TestCase
from django.core.management import call_command
from django.utils import timezone
from io import StringIO
from django.conf import settings
from django.test import override_settings
from contracts.models import Contract
from datetime import timedelta
from .models import Contract


# Create your tests here.
class TestContracts(BaseTestCase):
    """This class defines the tests for the contracts app."""

    databases = ["default", "staffnet"]

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        self.data = {
            "name": "Contract 1",
            "description": "Contract 1 description",
            "city": "City 1",
            "expected_start_date": "2020-01-01",
            "start_date": "2020-01-01",
            "renovation_date": "2020-12-31",
            "value": 1000000.10,
            "monthly_cost": 10000.11,
            "duration": "2020-01-01",
            "contact": "John Doe",
            "contact_telephone": "1234567890",
            "civil_responsibility_policy": "Civil Responsibility Policy",
            "compliance_policy": "Compliance Policy",
            "insurance_policy": "Insurance Policy",
        }
        self.contract = Contract.objects.create(**self.data)
        self.user = User.objects.get(username="staffnet")
        self.user.user_permissions.add(Permission.objects.get(codename="view_contract"))
        self.user.user_permissions.add(Permission.objects.get(codename="add_contract"))
        self.user.user_permissions.add(
            Permission.objects.get(codename="change_contract")
        )
        self.user.user_permissions.add(
            Permission.objects.get(codename="delete_contract")
        )
        self.user.save()

    def test_create_contract_without_permission(self):
        """Test the create contract endpoint."""
        self.user.user_permissions.remove(
            Permission.objects.get(codename="add_contract")
        )
        self.user.save()
        response = self.client.post(
            "/contracts/",
            self.data,
        )
        self.assertEqual(response.status_code, 403, response.data)

    def test_create_contract(self):
        """Test the create contract endpoint."""
        response = self.client.post(
            "/contracts/",
            self.data,
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["name"], "Contract 1")

    def test_get_contract_without_permission(self):
        """Test the get contract endpoint."""
        Contract.objects.create(**self.data)
        self.user.user_permissions.remove(
            Permission.objects.get(codename="view_contract")
        )
        self.user.save()
        response = self.client.get("/contracts/")
        self.assertEqual(response.status_code, 403, response.data)

    def test_get_all_contracts(self):
        """Test the get all contracts endpoint."""
        Contract.objects.create(**self.data)
        response = self.client.get("/contracts/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 2)

    def test_get_one_contract(self):
        """Test the get one contract endpoint."""
        response = self.client.get(f"/contracts/{self.contract.id}/")
        self.assertEqual(response.data["value"], "1.000.000,10")
        self.assertEqual(response.data["monthly_cost"], "10.000,11")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Contract 1")

    def test_update_contract_without_permission(self):
        """Test the update contract endpoint."""
        self.user.user_permissions.remove(
            Permission.objects.get(codename="change_contract")
        )
        self.user.save()
        response = self.client.put(
            f"/contracts/{self.contract.id}/",
            self.data,
        )
        self.assertEqual(response.status_code, 403, response.data)

    def test_update_contract(self):
        """Test the update contract endpoint."""
        self.data["name"] = "Contract 2"
        response = self.client.put(
            f"/contracts/{self.contract.id}/",
            self.data,
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Contract 2")

    def test_delete_contract_without_permission(self):
        """Test the delete contract endpoint."""
        self.user.user_permissions.remove(
            Permission.objects.get(codename="delete_contract")
        )
        self.user.save()
        response = self.client.delete(f"/contracts/{self.contract.id}/")
        self.assertEqual(response.status_code, 403, response.data)

    def test_delete_contract(self):
        """Test the delete contract endpoint."""
        response = self.client.delete(f"/contracts/{self.contract.id}/")
        self.assertEqual(response.status_code, 204, response.data)
        self.assertEqual(Contract.objects.count(), 0)


@override_settings(
    EMAIL_BACKEND="INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
)
class SchedulerTest(TestCase):
    """Test for scheduler."""

    def test_scheduler(self):
        """Test scheduler."""

        contract_data = {
            "name": "Contract 30 Days",
            "city": "Bogota",
            "description": "Test",
            "expected_start_date": timezone.now().date(),
            "value": 100000,
            "monthly_cost": 10000,
            "duration": timezone.now().date(),
            "contact": "Test",
            "contact_telephone": "123456789",
            "start_date": timezone.now().date(),
            "civil_responsibility_policy": "Test",
            "compliance_policy": "Test",
            "insurance_policy": "Test",
            "renovation_date": timezone.now().date() + timedelta(days=30),
        }

        contract_30_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date 15 days from now
        contract_data["name"] = "Contract 15 Days"
        contract_data["renovation_date"] = timezone.now().date() + timedelta(days=15)
        contract_15_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date 7 days from now
        contract_data["name"] = "Contract 7 Days"
        contract_data["renovation_date"] = timezone.now().date() + timedelta(days=7)
        contract_7_days = Contract.objects.create(**contract_data)

        # Create a contract with a renovation date today
        contract_data["name"] = "Contract Today"
        contract_data["renovation_date"] = timezone.now().date()
        contract_today = Contract.objects.create(**contract_data)

        # Run the logic to check for contract renewal
        stdout = StringIO()
        management_command_output = call_command("run_scheduler", stdout=stdout)

        self.assertIn(
            f"Email sent for contract {contract_30_days.name} to ['"
            + settings.EMAIL_FOR_TEST,
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_15_days.name} to ['"
            + settings.EMAIL_FOR_TEST,
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_7_days.name} to ['"
            + settings.EMAIL_FOR_TEST,
            stdout.getvalue(),
        )
        self.assertIn(
            f"Email sent for contract {contract_today.name} to ['"
            + settings.EMAIL_FOR_TEST,
            stdout.getvalue(),
        )
