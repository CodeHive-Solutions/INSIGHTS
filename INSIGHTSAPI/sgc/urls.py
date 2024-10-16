"""This module defines the url patterns for the goals app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SGCFileViewSet, SGCFileDownloadViewSet

# from .views import massive_update

router = DefaultRouter()
router.register("", SGCFileViewSet, basename="SGCFile")


urlpatterns = [
    path("", include(router.urls)),
    path(
        "file-download/sgc/<int:pk>/",
        SGCFileDownloadViewSet.as_view({"get": "get"}),
        name="sgc_file_download",
    ),
]
