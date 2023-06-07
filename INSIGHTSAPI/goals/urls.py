from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, ExcelGoalsViewSet

router = DefaultRouter()
router.register('excel-goals', ExcelGoalsViewSet, basename='excel_goal')
router.register('', GoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls))
]