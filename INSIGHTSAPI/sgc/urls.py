"""This module defines the url patterns for the goals app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SGCFileViewSet, SGCFileDownloadViewSet

router = DefaultRouter()
router.register("", SGCFileViewSet, basename="SGCFile")
# router.register("areas", SGCFileViewSet, basename="SGCArea")


urlpatterns = [
    path("", include(router.urls)),
    path(
        "file-download/sgc/<int:pk>/",
        SGCFileDownloadViewSet.as_view({"get": "get"}),
        name="sgc_file_download",
    ),
]
