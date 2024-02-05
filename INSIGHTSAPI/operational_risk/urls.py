"""urls for the operational_risk app"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventsViewSet

router = DefaultRouter()
router.register("", EventsViewSet, basename="events")

urlpatterns = [
    path("", include(router.urls)),
]
