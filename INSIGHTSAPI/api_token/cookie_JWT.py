"""
This module contains the CookieJWTAuthentication class, which is used to authenticate requests through a JSON web token.
"""
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger("requests")

class CookieJWTAuthentication(JWTAuthentication):
    """An authentication plugin that authenticates requests through a JSON web"""

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get('access-token')  # or 'refresh', depending on your needs
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

def always_true(user):
    """This function always return True"""
    if user:
        return True
    return False
