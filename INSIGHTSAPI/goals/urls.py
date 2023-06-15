from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import  GoalsViewSet

router = DefaultRouter()
router.register('', GoalsViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls))
]