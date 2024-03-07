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
            username = "david.alvarez"
            # username = "staffnet"
            # password = os.environ["StaffNetLDAP"]
            password = "asdf123.+"
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
        response = self.client.get("/goals/", cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response.status_code, 403)
        response2 = self.client.post(reverse("destroy-token"), cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response2.status_code, 200)
        response = self.client.get("/goals/", cookies=self.client.cookies)  # type: ignore
        self.assertEqual(response.status_code, 401)


class EmploymentCertificationTest(BaseTestCase):
    """Tests the employment certification views."""

    def test_get_my_employment_certification(self):
        """Tests that the user can get the employment certification."""
        self.user.cedula = "1000065648"
        self.user.save()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 200)
        # Check that the response is a pdf
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertTrue(
            response["Content-Disposition"].startswith(
                'attachment; filename="Certificado laboral STAFFNET LDAP.pdf"'
            )
        )

    def test_get_employment_certification_without_login(self):
        """Tests that the user cannot get the employment certification without logging in."""
        super().logout()
        response = self.client.post(reverse("send-employment-certification"))
        self.assertEqual(response.status_code, 401)

    def test_get_another_employment_certification_without_permission(self):
        """Tests that the user cannot get another user's employment certification without permission."""
        response = self.client.post(
            reverse("send-employment-certification"), {"identification": "1000065648"}
        )
        self.assertEqual(response.status_code, 403)
