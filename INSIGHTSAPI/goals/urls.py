from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import  ExcelGoalsViewSet

router = DefaultRouter()
router.register('', ExcelGoalsViewSet, basename='excel_goal')
# router.register('', GoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls))
]