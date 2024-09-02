"""Views for the SGC app"""

import logging
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page, cache_control
from django.utils.cache import get_cache_key
from rest_framework import renderers
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from .models import SGCFile, SGCArea
from .serializers import SGCFileSerializer, SGCAreaSerializer


logger = logging.getLogger("requests")

CACHE_DURATION = 60 * 15  # 15 minutes


class SGCFileViewSet(viewsets.ModelViewSet):
    """ViewSet for the SGC class"""

    queryset = SGCFile.objects.all().select_related("area")
    serializer_class = SGCFileSerializer
    # renderer_classes = [renderers.BrowsableAPIRenderer]
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    @method_decorator(cache_page(CACHE_DURATION, key_prefix="sgc"))
    def list(self, request, *args, **kwargs):
        """List the objects"""
        response = super().list(request, *args, **kwargs)
        data_list = list(response.data)
        permissions = {
            "add": request.user.has_perm("sgc.add_sgcfile"),
            "change": request.user.has_perm("sgc.change_sgcfile"),
            "delete": request.user.has_perm("sgc.delete_sgcfile"),
        }
        response.data = {"objects": data_list, "permissions": permissions}
        return response

    def create(self, request, *args, **kwargs):
        """Create a new object"""
        response = super().create(request, *args, **kwargs)
        cache.delete_pattern("*sgc*")  # Delete all cache keys with "sgc"
        return response

    def update(self, request, *args, **kwargs):
        """Update an object"""
        response = super().update(request, *args, **kwargs)
        cache.delete_pattern("*sgc*")  # Delete all cache keys with "sgc"
        return response

    def destroy(self, request, *args, **kwargs):
        """Destroy an object"""
        response = super().destroy(request, *args, **kwargs)
        cache.delete_pattern("*sgc*")  # Delete all cache keys with "sgc"
        return response


class SGCFileDownloadViewSet(FileDownloadMixin, viewsets.ReadOnlyModelViewSet):
    """ViewSet for the SGC class"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    model = SGCFile
    queryset = SGCFile.objects.all()


class SGCAreaViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for the SGC class"""

    queryset = SGCArea.objects.all()
    serializer_class = SGCAreaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
