"""This module contains the CookieJWTAuthentication class, which is used to authenticate requests through a JSON web token."""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    """An authentication plugin that authenticates requests through a JSON web"""
    # def get_customuser(self, validated_token):
    #     """Get the user from the validated token."""
    #     try:
    #         user = super().get_user(validated_token)
    #     except AuthenticationFailed as err:
    #         user = None
    #         print("llegue 1")
    #         print(err.detail["detail"])
    #     # Bypass the is_active check (consider potential security implications)
    #     return user

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get('access_token')  # or 'refresh', depending on your needs
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

def always_true(var):
    """This function always return True"""
    return True
