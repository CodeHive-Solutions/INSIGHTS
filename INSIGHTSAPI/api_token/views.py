"""Views for the api_token app."""

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth import logout
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.models import User


# This have to be done with cookies because the token can't be stored in the session due to security reasons
class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain view modified to send the token info in cookies."""

    # This change is to allow cookies to be set in the response
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.data and "access" in response.data:
            username = str(request.data["username"]).upper().strip()
            user = User.objects.get(username=username)
            if settings.DEBUG:
                samesite = "None"
                path = None
            else:
                samesite = "Lax"
                path = "/token/refresh/"
            response.set_cookie(
                "access-token",
                str(response.data["access"]),
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].seconds,
                httponly=True,
                secure=True,
                samesite=samesite,
                domain=".cyc-bpo.com",
            )
            response.set_cookie(
                "refresh-token",
                str(response.data["refresh"]),
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].seconds,
                httponly=True,
                secure=True,
                domain=".cyc-bpo.com",
                samesite=samesite,
                path=path,
            )
            response.data["permissions"] = user.get_all_permissions()
            response.data["cedula"] = user.cedula
            response.data["cargo"] = user.job_position.name
            response.data["email"] = user.email
            response.data["rango"] = user.job_position.rank
        return response


class CustomTokenRefreshView(TokenRefreshView):
    """Custom token refresh view modified to allow cookies."""

    # This change is to allow cookies to be set in the response
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh-token")
        if refresh_token:
            request.data["refresh"] = refresh_token  # type: ignore
        response = super().post(request, *args, **kwargs)
        if response.data and "access" in response.data:
            token = response.data["access"]
            response.set_cookie(
                "access-token",
                str(token),
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].seconds,
                httponly=True,
                secure=True,
                samesite="None",
            )
            response.data["permissions"] = request.user.get_all_permissions()
        return response


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    """Logout the user."""
    logout(request)
    response = Response({"message": "Logout successful"}, status=200)
    response.delete_cookie(
        "access-token", domain=".cyc-bpo.com", path="/", samesite="None"
    )
    response.delete_cookie(
        "refresh-token", domain=".cyc-bpo.com", path="/", samesite="None"
    )
    return response
