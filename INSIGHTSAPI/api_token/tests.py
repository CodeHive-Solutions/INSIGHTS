from rest_framework.test import APITestCase
from pathlib import Path
import os
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.conf import settings
import ldap # type: ignore
import json
from django.urls import reverse
from django.test.client import Client

class LDAPAuthenticationTest(APITestCase):
    def setUp(self):
        self.client = Client()

    def test_ldap_connection(self):
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        conn = None
        try:
            conn = ldap.initialize(ldap_server_uri)
            conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
            self.assertTrue(True, "LDAP connection successful.")
        except ldap.LDAPError as e:
            self.fail("Error: %s" % e)
        finally:
            if conn:
                conn.unbind_s()

    # def test_login(self):
    #     ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
    #     ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
    #     ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
    #     username = "heibert.mogollon"
    #     password = "Password4"
    #     conn = None
    #     try:
    #         conn = ldap.initialize(ldap_server_uri)
    #         conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
    #         search_filter = "(sAMAccountName={})".format(username)
    #         search_base = "dc=CYC-SERVICES,dc=COM,dc=CO"
    #         attributes = ['dn']
    #         result_id = conn.search(search_base, ldap.SCOPE_SUBTREE, search_filter, attributes)
    #         result_type, result_data = conn.result(result_id, 0)
    #         self.assertTrue(result_data, "User entry not found.")
    #         if result_data:
    #             user_dn = result_data[0][0]
    #             loged = conn.simple_bind_s(user_dn, password)
    #             self.assertTrue(loged, "User authentication failed.")
    #     except ldap.LDAPError as e:
    #         self.fail("Error: %s" % e)
    #     finally:
    #         if conn:
    #             conn.unbind()

    def test_token_obtain(self):
        # Create a test client
        client = APIClient()
        url = reverse('obtain_token')
        response = client.post(url, {'username': 'heibert.mogollon', 'password': 'Password4'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK) # type: ignore
        # Check if the response contains the access and refresh tokens
        self.assertIn('access', response.data) # type: ignore
        self.assertIn('refresh', response.data) # type: ignore
        return response

    def test_token_refresh(self):
        # Create a test client
        client = APIClient()
        url = reverse('refresh_token')
        response_obtain = self.test_token_obtain()
        refresh_token = response_obtain.data['refresh'] # type: ignore
        old_access_token = response_obtain.data['access'] # type: ignore
        response = client.post(url, {'refresh': refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK) # type: ignore
        self.assertIn('access', response.data) # type: ignore
        self.assertNotEqual(old_access_token, response.data['access']) # type: ignore

    def test_logout(self):
        # Create a test client
        client = APIClient()
        url = reverse('destroy_token')
        response_obtain = self.test_token_obtain()
        access_token = response_obtain.data['access'] # type: ignore
        response = client.post(url, {}, format='json', HTTP_AUTHORIZATION=f"Bearer {access_token}")
        self.assertEqual(response.status_code, status.HTTP_200_OK) # type: ignore
        response = client.post(url, {}, format='json', HTTP_AUTHORIZATION=f"Bearer {access_token}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) # type: ignore

    # def test_login_django(self, called=False):
    #     if called:
    #         username = "heibert.mogollon"
    #         password = "Password4"
    #         data = {
    #             'username': username,
    #             'password': password,
    #         }
    #         response = self.client.post(reverse('token_auth'), data)
    #         self.assertEqual(response.status_code, 200)
    #         token = json.loads(response.content.decode('utf-8')).get('token')
    #         self.assertIsNotNone(token, "No authentication token found in the response")
    #         return response

    # def test_login_fail(self):
    #     username = "heibert.mogollon"
    #     password = "WrongPassword"
    #     data = {
    #         'username': username,
    #         'password': password,
    #     }
    #     response = self.client.post(reverse('token_auth'), data)
    #     self.assertEqual(response.status_code, 400)
    #     token = json.loads(response.content.decode('utf-8')).get('token')
    #     self.assertIsNone(token, "Authentication token found in the response")

    # def test_logout(self):
    #     response = self.test_login_django(called=True)
    #     token = json.loads(response.content.decode('utf-8')).get('token') # type: ignore
    #     # Make a request that requires authentication
    #     response = self.client.get('/goals/', HTTP_AUTHORIZATION=f'Token {token}')
    #     self.assertEqual(response.status_code, 200)
    #     reponse2 = self.client.post('/logout/', HTTP_AUTHORIZATION=f'Token {token}')
    #     self.assertEqual(reponse2.status_code, 200)
    #     response3 = self.client.get('/goals/', HTTP_AUTHORIZATION=f'Token {token}')
    #     self.assertEqual(response3.status_code, 401)

    # def test_store_and_retrieve_session_data(self):
    #     # Create a user
    #     response = self.test_login_django(called=True)
    #     token = json.loads(response.content.decode('utf-8')).get('token')

    #     # Store data in the session
    #     session = self.client.session
    #     session['user_id'] = "test"
    #     session['username'] = "testeito"
    #     session.save()
    #     # Access a view that retrieves session data (replace with your view URL)
    #     response = self.client.post('/pruebas/', HTTP_AUTHORIZATION=f'Token {token}')
    #     # Check if the session data is present in the response
    #     self.assertEqual(response.status_code, 200)  # Assuming a successful response
    #     print("Response:",response.data) # type: ignore
    #     print(response.session.get('info'))
    #     self.assertEqual(response.data['user_id'], "test") # type: ignore
    #     self.assertEqual(response.data['info'], "informacion") # type: ignore 
    #     self.assertEqual(response.data['username'], "testeito") # type: ignore