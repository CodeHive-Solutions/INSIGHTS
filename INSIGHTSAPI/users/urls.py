from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import  AuthViewSet

router = DefaultRouter()
router.register('', AuthViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls))
]