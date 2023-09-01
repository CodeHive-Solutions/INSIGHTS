from django.test import TestCase
from django.test import RequestFactory
from django_auth_ldap.backend import LDAPBackend
from django.conf import settings
from django.test.client import Client
from ldap3 import Server, Connection, SIMPLE, ALL, SUBTREE
import ldap

class LDAPAuthenticationTest(TestCase):
    def setUp(self):
        # Create a test user in the Django database
        # self.test_user = get_user_model().objects.create_user(username="testuser", password="testpassword")

        # Set up the LDAP configurations for testing
        self.client = Client()

    def test_ldap_connection(self):
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        conn = None
        try:
            server = Server(ldap_server_uri, get_info=ALL)
            conn = Connection(server, user=ldap_bind_dn, password=ldap_bind_password, authentication=SIMPLE)
            conn.bind()
            self.assertTrue(conn.bound, "LDAP connection failed.")
        except Exception as e:
            self.fail("Error: %s" % e)
        finally:
            if conn:
                conn.unbind()

    def test_login_ldap3(self):
            ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
            ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
            ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
            username = "heibert.mogollon"
            password = "Password3"
            conn = None
            try:
                with Connection(Server(ldap_server_uri, get_info=ALL),user=ldap_bind_dn,password=ldap_bind_password,authentication=SIMPLE) as conn:
                    conn.bind()
                    user_entry = conn.search(
                        search_base="dc=CYC-SERVICES,dc=COM,dc=CO",
                        search_filter=f"(sAMAccountName={username})",
                        search_scope=SUBTREE,
                        attributes='CN'
                    )
                    self.assertTrue(user_entry, "User entry not found.")
                    if user_entry and conn.response:
                        user = conn.response[0]['dn']
                        conn.rebind(user=user, password=password)
                        self.assertTrue(conn.bound, "User authentication failed.")
            except Exception as e:
                self.fail("Error: %s" % e)
            finally:
                if conn:
                    conn.unbind()

    def test_login(self):
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
        username = "heibert.mogollon"
        password = "Password3"
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
        password = "Password3"
        request = RequestFactory().get('/mock-url')
        # Authenticate using the LDAP backend
        ldap_backend = LDAPBackend()
        user = ldap_backend.authenticate(request,username=username, password=password)
        print(user)
        # Assert the authentication result
        self.assertIsNotNone(user, "User authentication failed.")