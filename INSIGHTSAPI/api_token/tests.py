from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.conf import settings
import ldap # type: ignore
from django.urls import reverse

class LDAPAuthenticationTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

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

    def test_token_obtain(self):
        client = self.client
        url = reverse('obtain_token')
        client.post(url, {'username': 'heibert.mogollon', 'password': 'Password4'}, format='json')
        self.assertIn('access_token', client.cookies)
        self.assertIn('refresh_token', client.cookies)

    def test_token_refresh(self):
        client = self.client
        url = reverse('refresh_token')
        self.test_token_obtain()
        refresh_token = client.cookies['refresh_token'].value
        old_access_token = client.cookies['access_token'].value
        response = client.post(url, {'refresh': refresh_token}, format='json', cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', client.cookies)
        self.assertNotEqual(old_access_token, client.cookies['access_token'].value)

    def test_logout(self):
        client = self.client
        self.test_token_obtain()
        url = reverse('destroy_token')
        response = client.post(url, {}, format='json', cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = client.post(url, {}, format='json', cookies=client.cookies) # type: ignore
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_store_and_retrieve_session_data(self):
    #     # Create a user
    #     response = self.test_login_django(called=True)
    #     token = json.loads(response.content.decode('utf-8')).get('token')

    #     # Store data in the session
    #     session = self.client.session
    #     session['user_id'] = "test"
    #     session['username'] = "test"
    #     session.save()
    #     # Access a view that retrieves session data (replace with your view URL)
    #     response = self.client.post('/pruebas/', HTTP_AUTHORIZATION=f'Token {token}')
    #     # Check if the session data is present in the response
    #     self.assertEqual(response.status_code, 200)  # Assuming a successful response
    #     print("Response:",response.data) # type: ignore
    #     print(response.session.get('info'))
    #     self.assertEqual(response.data['user_id'], "test") # type: ignore
    #     self.assertEqual(response.data['info'], "información") # type: ignore 
    #     self.assertEqual(response.data['username'], "test") # type: ignore