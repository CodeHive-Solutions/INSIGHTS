from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from .models import Banner
from .serializer import BannerSerializer


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(active=True)
    serializer_class = BannerSerializer

    def create(self, request, *args, **kwargs):
        print("Create2")
        print("request:", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("serializer:", serializer.validated_data)
        response = super().create(request, *args, **kwargs)
        print(response.data)
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
