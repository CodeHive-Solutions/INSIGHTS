"""This module contains the url patterns for the api_token app."""
from django.urls import path
from .views import CustomTokenObtainPairView, logout_view, CustomTokenRefreshView

urlpatterns = [
    path('obtain/', CustomTokenObtainPairView.as_view(), name='obtain_token'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='refresh_token'),
    path('destroy/', logout_view, name='destroy_token'),
]
