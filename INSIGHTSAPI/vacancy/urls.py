"""This module contains the urls for the vacancy app."""
from django.urls import path
from .views import send_email_vacancy

urlpatterns = [
    path("vacancy/", send_email_vacancy, name="send_email_vacancy"),
]
