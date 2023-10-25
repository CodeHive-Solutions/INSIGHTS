"""This module defines the url patterns for the goals app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import  SGCFileViewSet

router = DefaultRouter()
router.register('', SGCFileViewSet, basename='SGCFile')

urlpatterns = [
    path('', include(router.urls))
]
