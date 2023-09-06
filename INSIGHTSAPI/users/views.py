from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout

class AuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user'] # type: ignore
        token, created = Token.objects.get_or_create(user=user)
        # Set the token as a cookie in the response
        response = super().post(request, *args, **kwargs)
        response.set_cookie('authentication_token', token.key, max_age=30*24*60*60, secure=True, httponly=True, samesite='Lax')
        return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    token_key = auth_header.split(' ')[1]
    Token.objects.get(key=token_key).delete()
    response = Response({'message': 'Logout successful'})
    response.delete_cookie('authentication_token')
    return response