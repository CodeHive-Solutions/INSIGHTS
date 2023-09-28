"""This module contains the url patterns for the api_token app."""
from django.urls import path
from .views import CustomTokenObtainPairView, logout_view

urlpatterns = [
    path('obtain/', CustomTokenObtainPairView.as_view(), name='obtain_token'),
    path('destroy/', logout_view, name='destroy_token'),
]
