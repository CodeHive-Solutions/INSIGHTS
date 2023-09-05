from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class AuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Authenticate with LDAP
        ldap_username = request.data.get('username')
        password = request.data.get('password')
        ldap_user = authenticate(request, ldap_username=ldap_username, password=password)

        if ldap_user:
            return Response({'token': "something"})
            # Check if a local user with the same LDAP username exists
            try:
                local_user = User.objects.get(ldap_username=ldap_username)
                # Generate a token for the local user
                token, created = Token.objects.get_or_create(user=local_user)
                return Response({'token': token.key})
            except User.DoesNotExist:
                return Response({'error': 'Credenciales'}, status=status.HTTP_404_NOT_FOUND)

        # If LDAP authentication fails or local user not found, use the default ObtainAuthToken behavior
        return super().post(request, *args, **kwargs)