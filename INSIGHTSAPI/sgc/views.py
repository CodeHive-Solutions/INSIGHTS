"""Views for the SGC app"""
import base64
import os
import logging
import mysql.connector
from ftfy import fix_text
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from django.core.files.base import ContentFile
from hierarchy.models import Area
from .models import SGCFile
from .serializers import SGCFileSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


logger = logging.getLogger("requests")

# connection = mysql.connector.connect(
#     host="172.16.0.6",
#     user="root",
#     password=os.environ["LEYES"],
#     database="userscyc",
# )
# cursor = connection.cursor(dictionary=True)
# cursor.execute(
#     """
#     SELECT
#         area as area,
#         tipo as type,
#         subtipo as sub_type,
#         nombre as name,
#         archivo as file,
#         version as version,
#         tipo_documento as tipo_documento
#     FROM userscyc.documentos_sgc
#     """
# )
# rows = cursor.fetchall()
# cursor.close()
# connection.close()
# # print(rows)
# sgc_files_to_create = []
# types_dict = {
#     1: "P",
#     2: "PR",
#     3: "PL",
#     4: "RG",
#     8: "MA",
#     9: "IN",
#     11: "CR",
# }
# for row in rows:
#     row["name"] = fix_text(row["name"])
#     row["type"] = types_dict.get(row["type"])
#     if row["tipo_documento"] == 2:
#         name = row["name"] + ".xlsx"
#     elif row["tipo_documento"] == 1:
#         name = row["name"] + ".pdf"
#     else:
#         name = row["name"]
#     content_file = ContentFile(row["file"], name=name)
#     sgc_files_to_create.append(
#         SGCFile(
#             name=row["name"],
#             area=Area.objects.get(id=row["area"]).name,
#             type=row["type"],
#             sub_type=row["sub_type"],
#             version=row["version"],
#             file=content_file,
#         )
#     )
# SGCFile.objects.bulk_create(sgc_files_to_create)


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


class SGCFileDownloadViewSet(FileDownloadMixin, viewsets.ReadOnlyModelViewSet):
    """ViewSet for the SGC class"""

    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    model = SGCFile
    queryset = SGCFile.objects.all()
