"""Users URL Configuration"""

from django.urls import path

from .views import update_profile, get_profile, get_subordinates

urlpatterns = [
    path("update-profile/", update_profile, name="update_profile"), 
    path("get-profile/", get_profile, name="get_profile"),
    path('get-subordinates/', get_subordinates, name='get_subordinates'),
]
