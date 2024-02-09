"""Views for the vacancy app."""
import sys
import base64
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from services.emails import send_email
from services.permissions import (
    DjangoModelViewPermissionsNotDelete,
    DjangoModelViewPermissionsAllowAllCreate,
)
from django.db import connections
from django.conf import settings
from users.models import User
from .serializers import VacancySerializer, ReferenceSerializer
from .models import Vacancy, Reference


class VacancyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Vacancy model"""

    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    permission_classes = [IsAuthenticated, DjangoModelViewPermissionsNotDelete]

    def list(self, request, *args, **kwargs):
        """List all the active vacancies."""
        queryset = Vacancy.objects.filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Deny any other update than active
    def update(self, request, *args, **kwargs):
        """Update a vacancy."""
        if len(request.data) == 1 and "is_active" in request.data:
            return super().update(request, *args, **kwargs)
        return Response(
            {"error": "No se puede modificar la vacante"}, status=400
        )

class ReferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Reference model"""

    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAuthenticated, DjangoModelViewPermissionsAllowAllCreate]

    def create(self, request, *args, **kwargs):
        """Create a reference and send a email to the user."""
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            reference = Reference.objects.get(id=response.data["id"])
            vacancy = reference.vacancy.name
            image = reference.vacancy.image
            image_data = base64.b64encode(image.read()).decode("utf-8")
            name = request.user.get_full_name().title()
            subject = f"Se registro una referencia para {vacancy}"
            message = f"""
                        <h2>{name} ha recomendado a nuestro proximo {vacancy}</h2>
                        Por favor comunícate con {reference.name} al {reference.phone_number} para obtener mas información.
                        """
            if settings.DEBUG or "test" in sys.argv:
                to_emails = ["heibert.mogollon@cyc-bpo.com"]
            else:
                to_emails = ["contrataciones@cyc-bpo.com"]
            errors = send_email(
                subject=subject,
                message=message,
                to_emails=to_emails,
                save_message=True,
                email_owner="Vacantes",
                safe_mode=False,
            )
            if errors:
                return Response(
                    {"error": "Hubo un error en el envió del correo"}, status=500
                )
        return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_vacancy_apply(request):
    """Send a email with the information of the user adn the vacancies that he/she applied for."""
    if not "vacancy" in request.data:
        return Response({"error": "No se envió la vacante"}, status=400)
    vacancy = Vacancy.objects.get(id=request.data["vacancy"])
    if not vacancy:
        return Response({"error": "No se encontró la vacante"}, status=400)
    name = request.user.get_full_name().title()
    subject = f"Aplicación a {vacancy}"
    user = User.objects.get(username=request.user)
    if user.cedula == 999999999 or settings.DEBUG or "test" in sys.argv:
        cedula = "1000065648"
        to_emails = ["heibert.mogollon@cyc-bpo.com"]
    else:
        cedula = user.cedula
        to_emails = ["contrataciones@cyc-bpo.com"]
    with connections["staffnet"].cursor() as cursor:
        cursor.execute(
            f"SELECT celular, correo, correo_corporativo FROM personal_information WHERE cedula = '{cedula}'"
        )
        user_info = cursor.fetchall()
    if not user_info:
        return Response({"error": "No se encontró información del usuario"}, status=400)
    if user_info[0][2]:
        email = user_info[0][2]
    else:
        email = user_info[0][1]
    email = str(email).lower()
    celular = user_info[0][0]
    with open(vacancy.image.path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")
        message = f"""
                <h2>Aplicación a {vacancy}</h2>
                <p>{name} aplico para {vacancy}</p>
                <p>Información del usuario:</p>
                <p>Nombre: {name}</p>
                <p>Cédula: {user.cedula}</p>
                <p>Correo: {email}</p>
                <p>Celular: {celular}</p>
                <img src="data:image/png;base64,{encoded_image}" alt="imagen_vacante.png" width="100%"/>
                """

    errors = send_email(
        subject=subject,
        message=message,
        to_emails=to_emails,
        save_message=True,
        email_owner="Vacantes",
        safe_mode=False,
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=500)
    return Response(
        {"message": f'Correo enviado correctamente a "{to_emails[0]}"'},
        status=200,
    )
