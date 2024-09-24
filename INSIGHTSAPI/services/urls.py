"""This module defines the URL patterns for the services app."""

from django.urls import path
from django.conf import settings
from .views import (
    send_report_ethical_line,
    trigger_error,
    get_holidays,
    save_answer,
    check_answered,
)


urlpatterns = [
    path("send-ethical-line/", send_report_ethical_line, name="send_ethical_line"),
    path("trigger-error/", trigger_error, name="trigger_error"),
    path("holidays/<int:year>/", get_holidays, name="get_holidays"),
    path("save-answer/", save_answer, name="save_answer"),
    path("check-answered/", check_answered, name="check_answered"),
]
