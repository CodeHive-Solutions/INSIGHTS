"""Views for the services app."""

import logging
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django_sendfile import sendfile
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import send_mail


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
        to_emails = [settings.EMAIL_FOR_TEST]
    else:
        to_emails = settings.EMAILS_ETHICAL_LINE
    send_mail(
        f"Denuncia de {request.data['complaint']}",
        f"\n{request.data['description']}\n" + contact_info,
        None,
        to_emails,
        fail_silently=False,
        html_message="True",
    )
    # if errors:
    #     return Response({"error": "Hubo un error en el envió del correo"}, status=500)
    return Response({"message": "Correo enviado correctamente"}, status=200)


def trigger_error(request):
    """Trigger an error for testing purposes."""
    raise Exception("Test error")
