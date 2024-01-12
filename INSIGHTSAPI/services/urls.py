"""This module defines the URL patterns for the services app."""
from django.urls import path
from django.conf import settings
from sgc.views import SGCFileDownloadViewSet
from .views import send_report_ethical_line
from .test_endpoint import test_endpoint


urlpatterns = [
    path("send-ethical-line/", send_report_ethical_line, name="send_ethical_line"),
    path(
        "file-download/sgc/<int:pk>/",
        SGCFileDownloadViewSet.as_view({"get": "get"}),
        name="sgc_file_download",
    ),
]
if settings.DEBUG:
    urlpatterns.append(path("test-endpoint/", test_endpoint, name="test_endpoint"))
