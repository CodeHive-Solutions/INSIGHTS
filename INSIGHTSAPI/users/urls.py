"""Users URL Configuration"""

from django.urls import path

from .views import update_user, get_users

urlpatterns = [
    path('update/', update_user, name='update_users'),
    path('get-users/', get_users, name='get_users'),
]
