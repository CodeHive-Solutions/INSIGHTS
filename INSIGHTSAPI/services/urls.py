"""This module defines the URL patterns for the services app."""
from django.urls import path
from .views import send_report_ethical_line
from sgc.views import SGCFileDownloadViewSet


urlpatterns = [
    path("send-ethical-line/", send_report_ethical_line, name="send_ethical_line"),
    path(
        "file-download/sgc/<int:pk>/",
        SGCFileDownloadViewSet.as_view({"get": "get"}),
        name="sgc_file_download",
    ),
]
