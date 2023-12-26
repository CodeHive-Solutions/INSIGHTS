"""Views for the SGC app"""
import logging
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from .models import SGCFile
from .serializers import SGCFileSerializer
import mysql.connector
import os
from django.core.files.base import ContentFile
from hierarchy.models import Area


logger = logging.getLogger("requests")


def upload_data():
    connection = mysql.connector.connect(
        host="172.16.0.6",
        user="root",
        password=os.environ["LEYES"],
        database="userscyc",
    )
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 
            area as area,
            tipo as type,
            subtipo as sub_type,
            nombre as name,
            archivo as file,
            version as version
        FROM userscyc.documentos_sgc
        """
    )
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    # print(rows)
    sgc_files_to_create = []
    for row in rows:
        content_file = ContentFile(row["file"])
        sgc_files_to_create.append(
            SGCFile(
                name=row["name"],
                area=Area.objects.get(id=row["area"]),
                type=row["type"],
                sub_type=row["sub_type"],
                version=row["version"],
                file=content_file,
            )
        )
    SGCFile.objects.bulk_create(sgc_files_to_create)


class SGCFileViewSet(viewsets.ModelViewSet):
    """ViewSet for the SGC class"""

    # upload_data()

    queryset = SGCFile.objects.all()
    serializer_class = SGCFileSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class SGCFileDownloadViewSet(FileDownloadMixin, viewsets.ReadOnlyModelViewSet):
    """ViewSet for the SGC class"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    model = SGCFile
    queryset = SGCFile.objects.all()
