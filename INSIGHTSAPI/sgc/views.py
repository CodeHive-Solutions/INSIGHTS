"""Views for the SGC app"""
import logging
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

# from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets
from .models import SGCFile
from .serializers import SGCFileSerializer

logger = logging.getLogger("requests")


class SGCFileViewSet(viewsets.ModelViewSet):
    """ViewSet for the SGC class"""

    queryset = SGCFile.objects.all()
    serializer_class = SGCFileSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]    
