"""This module defines the url patterns for the pqrs app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ComplaintViewSet

router = DefaultRouter()
router.register("", ComplaintViewSet, basename="complaint")

urlpatterns = [path("", include(router.urls))]
