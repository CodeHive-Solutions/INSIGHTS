"""This file contains the URL patterns for the vacation app."""
from django.urls import path
from .views import VacationRequestListView, VacationRequestCreateView

urlpatterns = [
    path("create/", VacationRequestCreateView.as_view(), name="create"),
    path("list/", VacationRequestListView.as_view(), name="list"),
]