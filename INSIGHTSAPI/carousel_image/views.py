from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissions
from .models import Banner
from .serializer import BannerSerializer


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter().order_by("order")
    serializer_class = BannerSerializer
    permission_classes = [DjangoModelPermissions]
