from django.urls import path
from .views import robinson_list

urlpatterns = [
    path('robinson_list/', robinson_list, name='robinson_list'),
]