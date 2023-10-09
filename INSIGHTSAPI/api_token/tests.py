"""Test the authentication."""
from django.urls import reverse
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
import ldap # type: ignore

class LDAPAuthenticationTest(APITestCase):
    """Test the LDAP authentication."""
    def setUp(self):
        self.client = APIClient()

    def test_ldap_connection(self):
        """Test that the LDAP server is reachable."""
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

    # def test_get_user_info(self):
    #     """Test that the LDAP server is reachable."""
    #     ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
    #     ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
    #     ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
    #     conn = None
    #     try:
    #         conn = ldap.initialize(ldap_server_uri)
    #         conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
    #         result = conn.search_s("OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO", ldap.SCOPE_SUBTREE, "(sAMAccountName=juan.carreno)")
    #         print(result)
    #     except ldap.LDAPError as err:
    #         self.fail(f"Error: {err}")
    #     finally:
    #         if conn:
    #             conn.unbind_s()

class TokenCheckTest(APITestCase):
    """Test the token authentication."""

    def setUp(self):
        self.client = APIClient()


    def test_token_obtain(self):
        """Test that the token obtain endpoint works correctly."""
        client = self.client
        url = reverse('obtain-token')
        response = client.post(url, {'username': 'heibert.mogollon', 'password': 'Password5'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access-token', client.cookies)
        self.assertIn('refresh-token', client.cookies)

    def test_token_obtain_fail(self):
        """Test that the token obtain endpoint works correctly."""
        client = self.client
        url = reverse('obtain-token')
        response = client.post(url, {'username': 'heibert.mogollon', 'password': 'TEST'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access-token', client.cookies)
        self.assertNotIn('refresh-token', client.cookies)

    def test_token_refresh(self):
        """Test that the refresh token endpoint works correctly."""
        client = self.client
        self.test_token_obtain()
        old_access_token = client.cookies['access-token'].value
        response = client.post(reverse('refresh-token'), {}, format='json', cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access-token', client.cookies)
        self.assertNotEqual(old_access_token, client.cookies['access-token'].value)

    def test_logout(self):
        """Test that the logout endpoint works correctly."""
        client = self.client
        self.test_token_obtain()
        url = reverse('destroy-token')
        response = client.post(url, {}, cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = client.post(reverse('robinson-list'), {}, format='json', cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



"""Tests for the users app."""
import json
import ldap
from django.contrib.auth.models import Permission
from users.models import User
from django.test import TestCase
from django.conf import settings
from django.urls import reverse
from django.test.client import Client


class LDAPAuthenticationTest(TestCase):
    """Tests the LDAP authentication."""

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
        username = "heibert.mogollon"
        password = "Password5"
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
            result_type, result_data = conn.result(result_id, 0)
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
            username = "heibert.mogollon"
            password = "Password5"
            data = {
                "username": username,
                "password": password,
            }
            response = self.client.post(reverse("obtain-token"), data)
            self.assertEqual(response.status_code, 200)
            token = self.client.cookies.get("access-token")
            refresh = self.client.cookies.get("refresh-token")
            self.assertIsNotNone(token, "No authentication token found in the response")
            self.assertIsNotNone(refresh, "No refresh token found in the response")
            return response

    def test_login_fail(self):
        """Tests that the login endpoint fails when the password is wrong."""
        username = "heibert.mogollon"
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
        response = self.client.get("/goals/", cookies=self.client.cookies) # type: ignore
        self.assertEqual(response.status_code, 200)
        response2 = self.client.post(reverse("destroy-token"), cookies=self.client.cookies) # type: ignore
        self.assertEqual(response2.status_code, 200)
        response3 = self.client.get(reverse("robinson-list"), cookies=self.client.cookies) # type: ignore
        self.assertEqual(response3.status_code, 401)

    def test_permission_check(self):
        """Tests that the permission check endpoint works as expected."""
        username = "juan.carreno"
        password = "cyc2024<"
        data = {
            "username": username,
            "password": password,
        }
        response = self.client.post(reverse("obtain-token"), data)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(reverse("robinson-list"), cookies=self.client.cookies) # type: ignore
        self.assertEqual(response.status_code, 403)
        self.test_logout()
        self.test_login_django(called=True)
        user = User.objects.get(username="heibert.mogollon")
        permission = Permission.objects.get(codename="add_logentry")
        user.user_permissions.add(permission)
        user.save()
        user.refresh_from_db()
        print(user.user_permissions.all())
        print(user.get_all_permissions())
        print(user.has_perm("admin.add_logentry"))
        response = self.client.post(reverse("robinson-list"), cookies=self.client.cookies) # type: ignore
        self.assertEqual(response.status_code, 400)
