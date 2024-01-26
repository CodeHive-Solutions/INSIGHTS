"""Views for the vacancy app."""
import base64
from io import BytesIO
from PIL import Image
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from services.permissions import (
    DjangoModelViewPermissionsNotDelete,
    DjangoModelViewPermissionsAllowAllCreate,
)
from django.db import connections
from django.utils import safestring
from users.models import User
from services.emails import send_email
from rest_framework import viewsets
from .serializers import VacancySerializer, ReferenceSerializer
from .models import Vacancy, Reference


class VacancyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Vacancy model"""

    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    permission_classes = [IsAuthenticated, DjangoModelViewPermissionsNotDelete]


class ReferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Reference model"""

    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAuthenticated, DjangoModelViewPermissionsAllowAllCreate]

    def create(self, request, *args, **kwargs):
        """Create a reference and send a email to the user."""
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            print("reference created")
            reference = Reference.objects.get(id=response.data["id"])
            vacancy = reference.vacancy.vacancy_name
            image = reference.vacancy.image
            image_data = base64.b64encode(image.read()).decode("utf-8")
            name = request.user.get_full_name().title()
            if "email" in request.data:
                subject = f"Aplica para {vacancy}"
                email = request.data["email"]
                to_emails = [email]
                message = f"""
                            <h2>Tu puedes ser el próximo {vacancy}</h2>
                            <p>{name} te ha recomendado para la vacante {vacancy}</p>
                            <p>¡Aprovecha esta oportunidad y aplica!</p>
                            <a href="https://cyc-bpo.com/contactenos/#Capa_1">
                            <img src="data:image/png;base64,{image_data}" alt="imagen_vacante.png" width="100%"/>
                            </a>
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
                    email = user_info[0][2]
                else:
                    email = user_info[0][1]
                email = str(email).lower()
                celular = user_info[0][0]
                # to_emails = ["contrataciones@cyc-bpo.com"]
                to_emails = [email]
                message = f"""
                            <h2>Aplicación a {vacancy}</h2>
                            <p>{name} aplico para {vacancy}</p>
                            <p>Información del usuario:</p>
                            <p>Nombre: {name}</p>
                            <p>Cédula: {user.cedula}</p>
                            <p>Correo: {email}</p>
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
                return Response(
                    {"error": "Hubo un error en el envió del correo"}, status=500
                )
            return Response(
                {"message": f'Correo enviado correctamente a "{email}"'},
                status=200,
            )
        return response


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def send_email_vacancy(request):
#     """Send a email with the information of the user adn the vacancies that he/she applied for."""
#     # if not "vacancy" in request.data:
#     # return Response({"error": "Las vacantes son requeridas"}, status=400)
#     # if not "image" in request.data:
#     # return Response({"error": "La imagen de la vacante es requerida"}, status=400)
#     vacancy = request.data["vacancy_name"]
#     image_data = request.data["image"]
#     name = request.user.get_full_name().title()

#     if "email" in request.data:
#         subject = f"Aplica para {vacancy}"
#         email = request.data["email"]
#         to_emails = [email]
#         message = f"""
#                     <h2>Tu puedes ser el próximo {vacancy}</h2>
#                     <p>{name} te ha recomendado para la vacante {vacancy}</p>
#                     <p>¡Aprovecha esta oportunidad y aplica!</p>
#                     <a href="https://cyc-bpo.com/contactenos/#Capa_1">
#                     <img src="data:image/png;base64,{image_data}" alt="imagen_vacante.png" width="100%"/>
#                     </a>
#                     """

#     else:
#         subject = f"Aplicación a {vacancy}"
#         user = User.objects.get(username=request.user)
#         with connections["staffnet"].cursor() as cursor:
#             cursor.execute(
#                 f"SELECT celular, correo, correo_corporativo FROM personal_information WHERE cedula = '{user.cedula}'"
#             )
#             user_info = cursor.fetchall()
#         if not user_info:
#             return Response(
#                 {"error": "No se encontró información del usuario"}, status=400
#             )
#         if user_info[0][2]:
#             email = user_info[0][2]
#         else:
#             email = user_info[0][1]
#         email = str(email).lower()
#         celular = user_info[0][0]
#         # to_emails = ["contrataciones@cyc-bpo.com"]
#         to_emails = [email]
#         message = f"""
#                     <h2>Aplicación a {vacancy}</h2>
#                     <p>{name} aplico para {vacancy}</p>
#                     <p>Información del usuario:</p>
#                     <p>Nombre: {name}</p>
#                     <p>Cédula: {user.cedula}</p>
#                     <p>Correo: {email}</p>
#                     <p>Celular: {celular}</p>
#                     <img src="data:image/png;base64,{image_data}" alt="imagen_vacante.png" width="100%"/>
#                     """

#     errors = send_email(
#         subject=subject,
#         message=message,
#         to_emails=to_emails,
#         save_message=True,
#         email_owner="Vacantes",
#         safe_mode=True,
#     )
#     if errors:
#         return Response({"error": "Hubo un error en el envió del correo"}, status=500)
#     return Response(
#         {"message": f'Correo enviado correctamente a "{email}"'},
#         status=200,
#     )
