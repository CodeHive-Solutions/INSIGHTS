# from django.test import TestCase
# import os
# from django.test.client import Client
# from django.contrib.auth.models import User

# class LDAPAuthenticationTest(TestCase):
#     def setUp(self):
#         # Create a test user in the Django database
#         self.test_user = User.objects.create_user(username="testuser", password="testpassword")

#         # Set up the LDAP configurations for testing
#         self.client = Client()
#         self.ldap_auth_uri = "/login/"  # Replace with your LDAP login URL
#         self.ldap_user = "Staffnet"     # Replace with your LDAP test username
#         self.ldap_password = os.getenv('Adminldap')  # Replace with your LDAP test password

#     def test_ldap_authentication(self):
#         # Attempt to log in using LDAP credentials
#         response = self.client.post(self.ldap_auth_uri, {"username": self.ldap_user, "password": self.ldap_password})

#         # Check if the login was successful
#         self.assertEqual(response.status_code, 302)  # Redirect indicates successful login
#         self.assertTrue(response.url.endswith("home/"))  # Replace "home/" with your home URL after successful login
#         self.assertTrue(response.wsgi_request.user.is_authenticated)

#         # Check if the user exists in the Django database
#         authenticated_user = User.objects.get(username=self.ldap_user)
#         self.assertEqual(authenticated_user.username, self.ldap_user)
#         # Add more assertions as needed based on your LDAP user attributes

#     def tearDown(self):
#         # Clean up after the test
#         self.test_user.delete()
