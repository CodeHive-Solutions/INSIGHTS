"""Views for the SGC app"""
import base64
import os
import logging
from django.http import JsonResponse
import mysql.connector
from ftfy import fix_text
from django.utils.text import slugify
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from services.views import FileDownloadMixin
from django.core.files.base import ContentFile
from .models import SGCFile, SGCArea
from .serializers import SGCFileSerializer, SGCAreaSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


logger = logging.getLogger("requests")


# @api_view(["GET"])
# def massive_update(request):
#     """Update the SGC files"""
#     try:
#         connection = mysql.connector.connect(
#             host="172.16.0.6",
#             user="root",
#             password=os.environ["LEYES"],
#             database="userscyc",
#         )
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute(
#             """
#             SELECT
#                 area as area,
#                 tipo as type,
#                 subtipo as sub_type,
#                 nombre as name,
#                 archivo as file,
#                 version as version,
#                 tipo_documento as tipo_documento
#             FROM userscyc.documentos_sgc
#             """
#         )
#         rows = cursor.fetchall()
#         cursor.execute(
#             """
#             SELECT * FROM userscyc.areas_sgc
#             """,
#         )
#         areas = cursor.fetchall()
#         for area in areas:
#             SGCArea.objects.get_or_create(
#                 pk=area["id_area_sgc"],
#                 short_name=area["nombre_area"],
#                 name=area["nombrec_area"],
#             )
#         cursor.close()
#         connection.close()
#         sgc_files_to_create = []
#         types_dict = {
#             1: "P",
#             2: "PR",
#             3: "PL",
#             4: "RG",
#             8: "MA",
#             9: "IN",
#             11: "CR",
#         }
#         for row in rows:
#             fixed_text = fix_text(row["name"])
#             slugged_text = slugify(fixed_text)
#             # fixed_text = row["name"]
#             row["type"] = types_dict.get(row["type"])
#             if row["tipo_documento"] == 2:
#                 name = slugged_text + ".xlsx"
#             elif row["tipo_documento"] == 1:
#                 name = slugged_text + ".pdf"
#             else:
#                 name = slugged_text
#             content_file = ContentFile(row["file"], name=name)
#             SGCFile.objects.create(
#                 name=fixed_text,
#                 area=SGCArea.objects.get(id=row["area"]),
#                 type=row["type"],
#                 sub_type=row["sub_type"],
#                 version=row["version"],
#                 file=content_file,
#             )
#             # sgc_files_to_create.append(file)
#         # SGCFile.objects.bulk_create(sgc_files_to_create)
#         return Response({"message": "Archivos creados"})
#     except Exception as e:
#         logger.critical(e, exc_info=True)
#         return Response({"error": str(e)}, status=500)


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
