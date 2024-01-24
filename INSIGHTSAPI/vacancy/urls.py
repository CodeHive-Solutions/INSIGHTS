"""This module contains the urls for the vacancy app."""
from django.urls import path
from rest_framework import routers
from .views import VacancyViewSet, ReferenceViewSet

router = routers.DefaultRouter()
router.register("vacancy", VacancyViewSet, basename="vacancy")
router.register("reference", ReferenceViewSet, basename="reference")

urlpatterns = router.urls
