"""Tests for the users app."""

import os
from services.tests import BaseTestCase
import ldap  # type: ignore
from users.models import User
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
            # username = "david.alvarez"
            # password = "asdf123.+"
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
