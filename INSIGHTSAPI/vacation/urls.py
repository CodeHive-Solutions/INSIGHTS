"""This file contains the URL patterns for the vacation app."""
from rest_framework.routers import DefaultRouter
# from django.urls import path, include
from .views import VacationRequestViewSet

router = DefaultRouter()
router.register("request", VacationRequestViewSet, basename="vacation-request")

# urlpatterns = [
#     path("", include(router.urls)),
#     path("get-working-days/", get_working_days_view, name="get-working-days"),
# ]
urlpatterns = router.urls