"""This module defines the url patterns for the pqrs app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ComplaintViewSet, ReasonListView

router = DefaultRouter()

router.register("complaints", ComplaintViewSet, basename="complaint")

urlpatterns = [
    path("", include(router.urls)),
    path("reasons/", ReasonListView.as_view(), name="reason-list"),
]
