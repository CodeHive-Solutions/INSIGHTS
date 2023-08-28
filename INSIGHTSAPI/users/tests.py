from django.test import TestCase
import ldap3
from django.contrib.auth import get_user_model
from django.conf import settings
from django.test.client import Client
from ldap3 import Server, Connection, SIMPLE, SYNC, ALL

class LDAPAuthenticationTest(TestCase):
    def setUp(self):
        # Create a test user in the Django database
        # self.test_user = get_user_model().objects.create_user(username="testuser", password="testpassword")

        # Set up the LDAP configurations for testing
        self.client = Client()

    def test_ldap_connection(self):
        # LDAP configuration from settings
        ldap_server_uri = settings.AUTH_LDAP_SERVER_URI
        ldap_bind_dn = settings.AUTH_LDAP_BIND_DN
        ldap_bind_password = settings.AUTH_LDAP_BIND_PASSWORD

        # LDAP connection for testing the LDAP bind
        server = ldap3.Server(ldap_server_uri)
        with ldap3.Connection(server, user=ldap_bind_dn, password=ldap_bind_password) as conn:
            connection_successful = conn.bind()

        self.assertTrue(connection_successful, "LDAP connection failed")

    # def test_user_authentication(self):
    #     # Simulate user login using the test user's credentials
    #     login_success = self.client.login(username="testuser", password="testpassword")
    #     if login_success:
    #         # Check if the user exists in the Django database
    #         User = get_user_model()
    #         user_exists = User.objects.filter(username="testuser").exists()
            
    #         if not user_exists:
    #             print("User authentication succeeded, but user doesn't exist in the database")
    #     else:
    #         self.fail("User authentication failed")

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


        # Check both Django authentication and user existence
        # self.assertTrue(login_success and user_exists, "User authentication failed")

    # def tearDown(self):
    #     # Clean up after the test
    #     self.test_user.delete()
