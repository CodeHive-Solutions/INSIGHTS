from rest_framework.routers import DefaultRouter
from .views import NotificationsViewSet

router = DefaultRouter()
router.register("", NotificationsViewSet, basename="notifications")

urlpatterns = router.urls
