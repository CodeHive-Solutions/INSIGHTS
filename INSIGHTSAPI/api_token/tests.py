"""Test the authentication."""
from django.urls import reverse
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
import ldap # type: ignore

class LDAPAuthenticationTest(APITestCase):
    databases = '__all__'

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

    databases = '__all__'

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
