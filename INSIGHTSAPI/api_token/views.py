from rest_framework.decorators import api_view, permission_classes
import logging
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView

logger = logging.getLogger("requests")

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.data:
            response.set_cookie(
                "access_token",
                str(response.data['access']),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].seconds,
                httponly=True,
                secure=True,
                samesite='Lax',
                domain='.cyc-bpo.com'
            )
            response.set_cookie(
                "refresh_token",
                str(response.data['refresh']),
                max_age=60*60*24,
                httponly=True,
                secure=True,
                samesite="Lax",
                domain='.cyc-bpo.com'
            )
        return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    print(request.user)
    response = Response({'message': 'Logout successful'})
    response.delete_cookie('access_token', domain='.cyc-bpo.com', path='/')
    response.delete_cookie('refresh_token', domain='.cyc-bpo.com', path='/')
    return response