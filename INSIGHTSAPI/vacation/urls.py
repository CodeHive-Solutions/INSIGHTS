"""This file contains the URL patterns for the vacation app."""

from rest_framework.routers import DefaultRouter

# from django.urls import path, include
from .views import VacationRequestViewSet

router = DefaultRouter()
router.register("", VacationRequestViewSet, basename="vacation")

urlpatterns = router.urls
