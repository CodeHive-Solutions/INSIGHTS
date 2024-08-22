"""Views for the SGC app"""

import logging
from rest_framework import renderers
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from .models import SGCFile, SGCArea
from .serializers import SGCFileSerializer, SGCAreaSerializer


logger = logging.getLogger("requests")


class SGCFileViewSet(viewsets.ModelViewSet):
    """ViewSet for the SGC class"""

    queryset = SGCFile.objects.all().select_related("area")
    serializer_class = SGCFileSerializer
    # renderer_classes = [renderers.BrowsableAPIRenderer, renderers.JSONRenderer]
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    @cache_response(timeout=60 * 15)
    def list(self, request, *args, **kwargs):
        """List the objects"""
        response = super().list(request, *args, **kwargs)
        data_list = list(response.data)
        # response["Cache-Control"] = "private, max-age=900"  # Cache for 15 minutes
        permissions = {
            "add": request.user.has_perm("sgc.add_sgcfile"),
            "change": request.user.has_perm("sgc.change_sgcfile"),
            "delete": request.user.has_perm("sgc.delete_sgcfile"),
        }
        response.data = {"objects": data_list, "permissions": permissions}
        return response

    def create(self, request, *args, **kwargs):
        """Create a new object"""
        cache.delete_pattern("sgc*")
        return super().create(request, *args, **kwargs)


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
