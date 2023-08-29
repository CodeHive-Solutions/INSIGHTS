from django.test import TestCase
from django.contrib.auth import get_user_model
from django.conf import settings
from django.test.client import Client
from ldap3 import Server, Connection, SIMPLE, SYNC, ALL, SUBTREE

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

    def test_login(self):
            ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
            ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
            ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD
            username = "heibert.mogollon"
            password = "Password3"
            conn = None
            try:
                server = Server(ldap_server_uri, get_info=ALL)
                conn = Connection(server, user=ldap_bind_dn, password=ldap_bind_password, authentication=SIMPLE)
                conn.bind()
                user_entry = conn.search(
                    search_base="dc=CYC-SERVICES,dc=COM,dc=CO",
                    search_filter="(sAMAccountName=%s)" % username,
                    search_scope=SUBTREE,
                    attributes='*'
                )
                print(conn.response)
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




        # Check both Django authentication and user existence
        # self.assertTrue(login_success and user_exists, "User authentication failed")

    # def tearDown(self):
    #     # Clean up after the test
    #     self.test_user.delete()
