"""Views for the api_token app."""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain view modified to send the token info in cookies."""
    # This change is to allow cookies to be set in the response
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.data and "access" in response.data:
            response.set_cookie(
                "access_token",
                str(response.data["access"]),
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].seconds,
                httponly=True,
                secure=True,
                # samesite='Lax',
                samesite="None",
                domain=".cyc-bpo.com",
            )
            response.set_cookie(
                "refresh_token",
                str(response.data["refresh"]),
                max_age=60 * 60 * 30,
                httponly=True,
                secure=True,
                # samesite="Lax",
                samesite="None",
                domain=".cyc-bpo.com",
                # path="/token/refresh/",
            )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    """Custom token refresh view modified to allow cookies."""

    # This change is to allow cookies to be set in the response
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            request.data["refresh"] = refresh_token  # type: ignore
        response = super().post(request, *args, **kwargs)
        if response.data and "access" in response.data:
            token = response.data["access"]
            response.set_cookie(
                "access_token",
                str(token),
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].seconds,
                httponly=True,
                secure=True,
                samesite="None",
            )
        return response


@api_view(["POST"])
def logout_view(request):
    response = Response({"message": "Logout successful"}, status=200)
    # response.delete_cookie("access_token", domain=".cyc-bpo.com", path="/")
    # response.delete_cookie("refresh_token", domain=".cyc-bpo.com", path="/")
    return response
