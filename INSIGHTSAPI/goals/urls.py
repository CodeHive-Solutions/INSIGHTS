from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, ExcelUploadView

router = DefaultRouter()
router.register('', GoalViewSet, basename='goal')

urlpatterns = [
    path('upload-excel/', ExcelUploadView.as_view(), name='upload-excel'),
    path('', include(router.urls)),
]