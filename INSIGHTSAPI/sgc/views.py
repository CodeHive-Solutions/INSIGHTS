"""Views for the SGC app"""

import logging
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from .models import SGCFile, SGCArea
from .serializers import SGCFileSerializer, SGCAreaSerializer


logger = logging.getLogger("requests")


class SGCFileViewSet(viewsets.ModelViewSet):
    """ViewSet for the SGC class"""

    queryset = SGCFile.objects.all()
    serializer_class = SGCFileSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    # Send the permissions of the user when listing the objects
    def list(self, request, *args, **kwargs):
        """List the objects"""
        # if not request.user.has_perm("sgc.view_sgcfile"):
        # return Response(
        # {"detail": "No tienes permiso para ver los archivos del SGC"},
        # status=403,
        # )
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
        # return {"detail": str(request.data)}, 500
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
