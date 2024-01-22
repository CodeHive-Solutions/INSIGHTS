"""Views for the services app."""
import logging
import os
import base64
from io import BytesIO
from PIL import Image
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django_sendfile import sendfile
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db import connections
from django.utils import safestring
from users.models import User
from .emails import send_email


logger = logging.getLogger("requests")


class FileDownloadMixin(APIView):
    """Mixin for download files."""

    # The model have to be put in the views
    model = None

    def get(self, request, pk):
        """Get the file."""
        file_instance = get_object_or_404(self.model, pk=pk)

        file_path = file_instance.file.path
        file_name = file_name = os.path.basename(file_path)

        response = sendfile(
            request,
            file_path,
            attachment=True,
            attachment_filename=file_name,
        )
        return response


@api_view(["POST"])
def send_report_ethical_line(request):
    """Send a report from the ethical line."""
    if not "complaint" in request.data:
        return Response({"error": "El tipo de denuncia es requerido"}, status=400)
    if not "description" in request.data:
        return Response(
            {"error": "La descripción de la denuncia es requerida"}, status=400
        )

    contact_info = ""
    if "contact_info" in request.data:
        contact_info = f"\nEl usuario desea ser contactado mediante:\n{request.data['contact_info']}"
    if settings.DEBUG or "test" in request.data["complaint"].lower():
        to_emails = ["heibert.mogollon@cyc-bpo.com", "juan.carreno@cyc-bpo.com"]
    else:
        to_emails = [
            "cesar.garzon@cyc-bpo.com",
            "mario.giron@cyc-bpo.com",
            "jeanneth.pinzon@cyc-bpo.com",
        ]
    errors = send_email(
        sender_user="mismetas",
        subject=f"Denuncia de {request.data['complaint']}",
        message=f"\n{request.data['description']}\n" + contact_info,
        to_emails=to_emails,
        html_content=True,
        email_owner="Línea ética",
        return_path="heibert.mogollon@cyc-bpo.com",
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=400)
    return Response({"message": "Correo enviado correctamente"}, status=200)
