"""Urls for contracts app """

from rest_framework import routers

from .views import ContractViewSet

router = routers.DefaultRouter()
router.register("", ContractViewSet, basename="contract")

urlpatterns = router.urls
