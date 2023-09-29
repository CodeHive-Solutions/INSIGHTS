# """Middleware to redirect to another endpoint."""
# from django.http import HttpResponseRedirect
# from django.urls import reverse
# from rest_framework_simplejwt.views import TokenRefreshView
# from django.conf import settings
# import logging

# class CustomTokenRefreshView(TokenRefreshView):
#     """Custom token refresh view modified to allow cookies."""
#     # This change is to allow cookies to be set in the response
#     def post(self, request, *args, **kwargs):
#         refresh_token = request.COOKIES.get("refresh_token")
#         if refresh_token:
#             request.data["refresh"] = refresh_token  # type: ignore
#         response = super().post(request, *args, **kwargs)
#         if response.data and "access" in response.data:
#             token = response.data["access"]
#             response.set_cookie(
#                 "access_token",
#                 str(token),
#                 max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].seconds,
#                 httponly=True,
#                 secure=True,
#                 samesite="None",
#             )
#         return response

# class RedirectMiddleware:
#     """Middleware to redirect to another endpoint."""
#     logger = logging.getLogger("requests")

#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         response = self.get_response(request)
#         # Check if the response status code is 403 Forbidden
#         if response.status_code == 401:
#             CustomTokenRefreshView().post(request)
#         return response

