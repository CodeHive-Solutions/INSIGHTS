"""Urls for blog app """

from rest_framework import routers

from .views import BlogViewSet

router = routers.DefaultRouter()
router.register("", BlogViewSet, basename="blog")

urlpatterns = router.urls
