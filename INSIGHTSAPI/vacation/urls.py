"""This file contains the URL patterns for the vacation app."""
from django.urls import path
from .views import VacationRequestListView, VacationRequestCreateView, VacationRequestRetrieveView

urlpatterns = [
    path("create/", VacationRequestCreateView.as_view(), name="vacation_create"),
    path("list/", VacationRequestListView.as_view(), name="vacation_list"),
    path("retrieve/<int:pk>/", VacationRequestRetrieveView.as_view(), name="vacation_retrieve"),
]