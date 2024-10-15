"""This module defines the url patterns for the pqrs app."""

from django.urls import path

from .views import ManagementListView, PQRSViewSet

urlpatterns = [
    path("management/", ManagementListView.as_view(), name="management"),
    path("pqrs/", PQRSViewSet.as_view(), name="pqrs"),
]
