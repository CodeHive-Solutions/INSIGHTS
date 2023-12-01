# from django_auth_ldap.backend import LDAPBackend

# class CustomLDAPBackend(LDAPBackend):
#     """"""
#     def authenticate(self, request, username=None, password=None, **kwargs):
#         # Perform LDAP authentication here
#         # If LDAP authentication succeeds, return the user object
#         # If LDAP authentication fails, raise a PermissionError

#         if ldap_authentication_succeeds(username, password):
#             # If LDAP authentication is successful, return the user object
#             user = super().authenticate(request, username=username, password=password, **kwargs)
#             return user
#         else:
#             # If LDAP authentication fails, raise a PermissionError
#             raise PermissionError("LDAP authentication failed")
