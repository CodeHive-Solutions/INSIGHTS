"""Views for the vacancy app."""
import base64
from io import BytesIO
from PIL import Image
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import connections
from django.utils import safestring
from users.models import User
from services.emails import send_email


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_email_vacancy(request):
    """Send a email with the information of the user adn the vacancies that he/she applied for."""
    if not "vacancy" in request.data:
        return Response({"error": "Las vacantes son requeridas"}, status=400)
    if not "image" in request.data:
        return Response({"error": "La imagen de la vacante es requerida"}, status=400)

    vacancy = request.data["vacancy"]
    image_data = request.data["image"]
    name = request.user.get_full_name().title()
    if "correo" in request.data:
        subject = f"Aplica para {vacancy}"
        correo = request.data["correo"]
        to_emails = [correo]
        message = f"""
                    <h2>Tu puedes ser el próximo {vacancy}</h2>
                    <p>{name} te ha recomendado para la vacante {vacancy}</p>
                    <p>¡Aprovecha esta oportunidad y aplica!</p>
                    <img src="data:image/png;base64,{image_data}" alt="imagen_vacante.png" width="100%" href="https://cyc-bpo.com/" />
                    """

    else:
        subject = f"Aplicación a {vacancy}"
        user = User.objects.get(username=request.user)
        with connections["staffnet"].cursor() as cursor:
            cursor.execute(
                f"SELECT celular, correo, correo_corporativo FROM personal_information WHERE cedula = '{user.cedula}'"
            )
            user_info = cursor.fetchall()
        if not user_info:
            return Response(
                {"error": "No se encontró información del usuario"}, status=400
            )
        if user_info[0][2]:
            correo = user_info[0][2]
        else:
            correo = user_info[0][1]
        correo = str(correo).lower()
        celular = user_info[0][0]
        # to_emails = ["contrataciones@cyc-bpo.com"]
        to_emails = [correo]
        message = f"""
                    <h2>Aplicación a {vacancy}</h2>
                    <p>{name} aplico para {vacancy}</p>
                    <p>Información del usuario:</p>
                    <p>Nombre: {name}</p>
                    <p>Cédula: {user.cedula}</p>
                    <p>Correo: {correo}</p>
                    <p>Celular: {celular}</p>
                    <img src="data:image/png;base64,{image_data}" alt="imagen_vacante.png" width="100%"/>
                    """

    errors = send_email(
        subject=subject,
        message=message,
        to_emails=to_emails,
        save_message=True,
        email_owner="Vacantes",
        safe_mode=True,
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=500)
    return Response(
        {"message": f'Correo enviado correctamente a "{correo}"'},
        status=200,
    )