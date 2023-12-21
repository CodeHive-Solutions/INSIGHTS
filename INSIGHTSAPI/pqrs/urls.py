"""This module defines the url patterns for the pqrs app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ComplaintViewSet,
    CongratulationViewSet,
    SuggestionViewSet,
    OtherViewSet,
)

router = DefaultRouter()

router.register("complaints", ComplaintViewSet, basename="complaint")
router.register("congratulations", CongratulationViewSet, basename="congratulation")
router.register("suggestions", SuggestionViewSet, basename="suggestion")
router.register("others", OtherViewSet, basename="other")

urlpatterns = [
    path("", include(router.urls)),
]
