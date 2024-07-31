"""This module defines the URL patterns for the services app."""

from django.urls import path
from django.conf import settings
from .views import (
    send_report_ethical_line,
    trigger_error,
    get_holidays,
    get_questions,
    save_answer,
)
from .test_endpoint import test_endpoint


urlpatterns = [
    path("send-ethical-line/", send_report_ethical_line, name="send_ethical_line"),
    path("trigger-error/", trigger_error, name="trigger_error"),
    path("holidays/<int:year>/", get_holidays, name="get_holidays"),
    path("questions/", get_questions, name="get_questions"),
    path("save-answer/", save_answer, name="save_answer"),
]
if settings.DEBUG:
    urlpatterns.append(path("test-endpoint/", test_endpoint, name="test_endpoint"))
