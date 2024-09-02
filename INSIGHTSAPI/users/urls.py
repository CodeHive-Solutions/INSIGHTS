"""Users URL Configuration"""

from django.urls import path

from .views import (
    update_profile,
    get_profile,
    get_subordinates,
    get_points,
    upload_points,
)

urlpatterns = [
    path("update-profile/", update_profile, name="update_profile"),
    path("get-profile/", get_profile, name="get_profile"),
    path("get-subordinates/", get_subordinates, name="get_subordinates"),
    path("get-points/", get_points, name="get_points"),
    path("upload-points/", upload_points, name="upload_points"),
]
