"""Tests for the users app."""

import os
import ldap  # type: ignore
import random
from services.tests import BaseTestCase
from users.models import User
from hierarchy.models import Area
from django.test import TestCase
from django.conf import settings
from django.urls import reverse
from django.test.client import Client


class LDAPAuthenticationTest(TestCase):
    """Tests the LDAP authentication."""

    databases = "__all__"

    def setUp(self):
        """Sets up the test client."""
        self.client = Client()

    def test_ldap_connection(self):
        """Tests that the connection to the LDAP server is successful."""
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        conn = None
        try:
            conn = ldap.initialize(ldap_server_uri)
            conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
        except ldap.LDAPError as err:
            self.fail(f"Error: {err}")
        finally:
            if conn:
                conn.unbind_s()

    def test_login(self):
        """Tests that the user can login using LDAP."""
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        username = "staffnet"
        password = os.environ["StaffNetLDAP"]
        conn = None
        try:
            conn = ldap.initialize(ldap_server_uri)
            conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
            search_filter = "(sAMAccountName={})".format(username)
            search_base = "dc=CYC-SERVICES,dc=COM,dc=CO"
            attributes = ["dn"]
            result_id = conn.search(
                search_base, ldap.SCOPE_SUBTREE, search_filter, attributes
            )
            _, result_data = conn.result(result_id, 0)
            self.assertTrue(result_data, "User entry not found.")
            if result_data:
                user_dn = result_data[0][0]
                logged = conn.simple_bind_s(user_dn, password)
                self.assertTrue(logged, "User authentication failed.")
        except ldap.LDAPError as err:
            self.fail("Error: %s" % err)
        finally:
            if conn:
                conn.unbind()

    def test_login_django(self, called=False):
        """Tests that the login endpoint works as expected."""
        if called:
            username = "staffnet"
            password = os.environ["StaffNetLDAP"]
            data = {
                "username": username,
                "password": password,
            }
            response = self.client.post(reverse("obtain-token"), data)
            self.assertEqual(response.status_code, 200, response.data)
            token = self.client.cookies.get("access-token")
            refresh = self.client.cookies.get("refresh-token")
            self.assertIsNotNone(token, "No authentication token found in the response")
            self.assertIsNotNone(refresh, "No refresh token found in the response")
            self.assertEqual(User.objects.count(), 1)
            user = User.objects.first()
            if user:
                self.assertEqual(str(user.username).lower(), username)
                self.assertEqual(user.email, settings.EMAIL_FOR_TEST)
                self.assertEqual(user.first_name, "STAFFNET")
                self.assertEqual(user.last_name, "LDAP")
                self.assertEqual(user.job_position.name, "Administrador")
                self.assertEqual(user.job_position.rank, 9)
            else:
                self.fail("User not created.")
            return response

    def test_login_update_user_without_windows_user(self):
        """Tests that the login endpoint fails when the user is not in the windows server."""
        username = "staffnet"
        password = os.environ["StaffNetLDAP"]
        data = {
            "username": username,
            "password": password,
        }
        User.objects.create(
            username="",
            cedula="00000000",
            first_name="Administrador",
            last_name="",
        )
        # print(User.objects.first())
        response = self.client.post(reverse("obtain-token"), data)
        self.assertEqual(response.status_code, 200, response.data)

    def test_login_fail(self):
        """Tests that the login endpoint fails when the password is wrong."""
        username = "staffnet"
        password = "WrongPassword"
        data = {
            "username": username,
            "password": password,
        }
        response = self.client.post(reverse("obtain-token"), data)
        self.assertEqual(response.status_code, 401)
        token = self.client.cookies.get("access-token")
        self.assertIsNone(token, "Authentication token found in the response")

    def test_logout(self):
        """Tests that the logout endpoint works as expected."""
        response = self.test_login_django(called=True)
        # Make a request that requires authentication
        response = self.client.get("/contracts/", cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response.status_code, 403)
        response2 = self.client.post(reverse("destroy-token"), cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response2.status_code, 200)
        response = self.client.get("/goals/", cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response.status_code, 401)


class UserTestCase(BaseTestCase):

    def test_get_full_name(self):
        """Tests that the full name is returned correctly."""
        user = User(first_name="David", last_name="Alvarez")
        self.assertEqual(user.get_full_name(), "David Alvarez")

    def test_get_full_name_reversed(self):
        """Tests that the full name is returned correctly."""
        user = User(first_name="David", last_name="Alvarez")
        self.assertEqual(user.get_full_name_reversed(), "Alvarez David")

    def test_get_subordinates_same_area(self):
        """Tests that the get_users endpoint can return users from the same area."""
        self.user.job_position.rank = 3
        self.user.job_position.save()
        demo_user = self.create_demo_user()
        demo_user.area = self.user.area
        demo_user.save()
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [
                {"id": demo_user.pk, "name": demo_user.get_full_name()},
            ],
        )

    def test_get_subordinates_multiple_area(self):
        """Tests that the get_users endpoint can return users from multiple areas if the user is the manager."""
        self.user.job_position.rank = 3
        self.user.job_position.save()
        demo_user_1 = self.create_demo_user()
        demo_user_1.area = Area.objects.get_or_create(name="Demo")[0]
        demo_user_1.area.manager = self.user
        demo_user_1.area.save()
        demo_user_1.save()
        demo_user_2 = self.create_demo_user()
        demo_user_2.area = Area.objects.get_or_create(name="Demo")[0]
        demo_user_2.save()
        # print(User.objects.filter(area__manager=self.user))
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [
                {"id": demo_user_1.pk, "name": demo_user_1.get_full_name()},
                {"id": demo_user_2.pk, "name": demo_user_2.get_full_name()},
            ],
        )

    def test_get_subordinates_area_no_manager(self):
        """Tests that the get_users endpoint does not return users from areas that the user does not manage."""
        demo_user = self.create_demo_user()
        demo_user.area = Area.objects.get_or_create(name="Demo")[0]
        demo_user.save()
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        # response.data should be 1 that is the user itself
        self.assertEqual(len(response.data), 1)

    def test_get_subordinates_higher_rank(self):
        """Tests that the get_users endpoint does not return users with a higher rank."""
        boss = self.create_demo_user()
        boss.job_position.rank = 100
        boss.job_position.save()
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        # response.data should be 1 that is the user itself
        self.assertEqual(len(response.data), 1)

    def test_get_subordinates_manager(self):
        """Tests that the get_users endpoint returns the manager of the user."""
        self.user.job_position.rank = 4
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data, [{"id": self.user.pk, "name": self.user.get_full_name()}]
        )

    def test_get_subordinates_no_manager(self):
        """Tests that the get_users endpoint returns an empty list if the user does not have a manager."""
        self.user.job_position.rank = 1
        self.user.job_position.save()
        response = self.client.get(reverse("get_subordinates"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_get_user_profile(self):
        """Tests that the get_user_profile endpoint works as expected."""
        self.user.cedula = settings.TEST_CEDULA
        self.user.save()
        response = self.client.get(reverse("get_profile"))
        self.assertEqual(response.status_code, 200, response.data)

    def test_update_user(self):
        """Tests that the update_user endpoint works as expected."""
        # Create a random number for cell phone
        data = {"estado_civil": "Soltero", "hijos": random.randint(0, 999999)}
        self.user.cedula = settings.TEST_CEDULA
        self.user.save()
        response = self.client.patch(reverse("update_profile"), data)
        self.assertEqual(response.status_code, 200, response.data)

    def test_update_user_email(self):
        """Tests that the update_user endpoint works as expected."""
        data = {"correo": "test{}@cyc-bpo.com".format(random.randint(0, 999999))}
        self.user.cedula = 1001185389
        self.user.save()
        response = self.client.patch(reverse("update_profile"), data)
        self.assertEqual(response.status_code, 200, response.data)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, str(data["correo"]).upper())

    def test_user_creation(self):
        """Tests that the user creation works as expected."""
        user = User.objects.create(
            username="user_test".format(random.randint(0, 999999)),
            cedula=os.environ["TEST_CEDULA"],
            first_name="Test",
            last_name="User",
        )
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(
            User.objects.get(pk=user.pk).company_mail,
            os.environ["EMAIL_FOR_TEST"].upper(),
        )
