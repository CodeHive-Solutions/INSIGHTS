"""
This module contains the CookieJWTAuthentication class,
which is used to authenticate requests through a JSON web token.
"""

import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

logger = logging.getLogger("requests")


class CustomAuthBackend(ModelBackend):
    """Custom authentication backend."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        """Authenticate the superusers."""
        if not request:
            user_model = get_user_model()
            try:
                user = user_model.objects.get(username=username)
            except user_model.DoesNotExist:
                return None

            # Check if the user is a superuser
            if user.is_superuser:
                if user.check_password(password):
                    return user
            else:
                jwt_authentication = CookieJWTAuthentication()
                return jwt_authentication.authenticate(request)

    def get_user(self, user_id):
        user_model = get_user_model()

        try:
            return user_model.objects.get(pk=user_id)
        except user_model.DoesNotExist:
            return None


class CookieJWTAuthentication(JWTAuthentication):
    """An authentication plugin that authenticates requests through a JSON web token."""

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get("access-token")
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
