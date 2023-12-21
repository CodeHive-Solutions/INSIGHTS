"""This module defines the URL patterns for the services app."""
from django.urls import path
from .views import send_report_ethical_line


urlpatterns = [
    path("send-ethical-line/", send_report_ethical_line, name="send_ethical_line"),
]
