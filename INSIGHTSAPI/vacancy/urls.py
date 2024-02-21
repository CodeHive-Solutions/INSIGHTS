"""This module contains the urls for the vacancy app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VacancyViewSet, ReferenceViewSet, send_vacancy_apply

router = DefaultRouter()
router.register("vacancy", VacancyViewSet, basename="vacancy")
router.register("reference", ReferenceViewSet, basename="reference")

urlpatterns = [
    path("", include(router.urls)),
    path("apply/", send_vacancy_apply, name="vacancy_apply"),
]
