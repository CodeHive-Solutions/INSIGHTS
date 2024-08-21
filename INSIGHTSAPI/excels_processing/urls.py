"""This module contains the urls for the excels_processing app."""
from django.urls import path
from .views import robinson_list, call_transfer_list

urlpatterns = [
    path("robinson-list/", robinson_list, name="robinson-list"),
    path("call-transfer-list/", call_transfer_list, name="call-transfer-list"),
]
