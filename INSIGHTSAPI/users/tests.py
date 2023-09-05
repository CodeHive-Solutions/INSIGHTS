from django.test import TestCase
from django.conf import settings
import ldap
import json
from django.urls import reverse
from django.test.client import Client

class LDAPAuthenticationTest(TestCase):
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

    def test_login(self):
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        username = "heibert.mogollon"
        password = "Password4"
        conn = None
        try:
            conn = ldap.initialize(ldap_server_uri)
            conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
            search_filter = "(sAMAccountName={})".format(username)
            search_base = "dc=CYC-SERVICES,dc=COM,dc=CO"
            attributes = ['dn']
            result_id = conn.search(search_base, ldap.SCOPE_SUBTREE, search_filter, attributes)
            result_type, result_data = conn.result(result_id, 0)
            self.assertTrue(result_data, "User entry not found.")
            if result_data:
                user_dn = result_data[0][0]
                loged = conn.simple_bind_s(user_dn, password)
                self.assertTrue(loged, "User authentication failed.")
        except ldap.LDAPError as e:
            self.fail("Error: %s" % e)
        finally:
            if conn:
                conn.unbind()

    def test_login_django(self):
        username = "heibert.mogollon"
        password = "Password4"
        data = {
            'username': username,
            'password': password,
        }
        response = self.client.post(reverse('token_auth'), data)
        self.assertEqual(response.status_code, 200)
        token = json.loads(response.content.decode('utf-8')).get('token')
        self.assertIsNotNone(token, "No authentication token found in the response")