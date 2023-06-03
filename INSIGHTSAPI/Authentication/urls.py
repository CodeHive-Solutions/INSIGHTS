from django.urls import path
from . import views

urlpatterns = [
    path('', views.LDAPAuthView.as_view(), name='login'),
]

