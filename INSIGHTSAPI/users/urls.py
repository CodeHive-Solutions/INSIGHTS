"""Users URL Configuration"""

from django.urls import path

from .views import update_profile, get_profile

urlpatterns = [
    path("update-profile/", update_profile, name="update_profile"), 
    path("get-profile/", get_profile, name="get_profile"),
    # path('get-users/', get_users, name='get_users'),
]
