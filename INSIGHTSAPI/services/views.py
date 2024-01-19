"""Views for the services app."""
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_email_vacancy(request):
    """Send a email with the information of the user adn the vacancies that he/she applied for."""
    if not "vacancy" in request.data:
        return Response({"error": "Las vacantes son requeridas"}, status=400)
    if not "image" in request.data:
        return Response({"error": "La imagen de la vacante es requerida"}, status=400)
    vacancy = request.data["vacancy"]
    user = User.objects.get(username=request.user)
    # image_data = request.data["image"]
    # image_b64 = base64.b64encode(image_data).decode("utf-8")
    image_data = base64.b64decode(request.data["image"])
    image_object = Image.open(BytesIO(image_data))
    # image_src = f"data:image/png;base64,{request.data['image']}"
    with connections["staffnet"].cursor() as cursor:
        cursor.execute(
            f"SELECT celular, correo, correo_corporativo correo FROM personal_information WHERE cedula = '{user.cedula}'"
        )
        user_info = cursor.fetchall()
    if not user_info:
        return Response({"error": "No se encontró información del usuario"}, status=400)
    if user_info[0][2]:
        correo = user_info[0][2]
    else:
        correo = user_info[0][1]
    subject = f"Aplicación a {vacancy}"
    message = f"""
                <h2>Aplicación a {vacancy}</h2>
                <p>El usuario {user.first_name} {user.last_name} ha aplicado a la vacante {vacancy}</p>
                <p>Correo: {correo}</p>
                <p>Celular: {user_info[0][0]}</p>
                <p>Adjunto la imagen de la vacante1</p>
                f{image_object}
                """

    errors = send_email(
        # sender_user="mismetas",
        subject=subject,
        message=message,
        to_emails=[correo.lower()],
        save_message=True,
        email_owner="Vacantes",
        safe_mode=True,
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=500)
    return Response({"message": f"Correo enviado correctamente a {correo}"}, status=200)
