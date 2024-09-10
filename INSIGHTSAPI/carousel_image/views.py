from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from .models import Banner
from .serializer import BannerSerializer


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(active=True)
    serializer_class = BannerSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
