"""This module contains the PQRS viewset."""

import logging

from django.core.mail import mail_admins, send_mail
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from users.models import User

from .models import PQRS, Management
from .serializers import ManagementSerializer, PQRSSerializer

logger = logging.getLogger("requests")


class ManagementListView(ListAPIView):
    """This class represents the Management list view."""

    serializer_class = ManagementSerializer
    queryset = Management.objects.all()


class PQRSViewSet(CreateAPIView):
    """This class represents the PQRS viewset."""

    serializer_class = PQRSSerializer
    queryset = PQRS.objects.all()

    def create(self, request, *args, **kwargs):
        """Save the post data when creating a new model instance."""
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            attendant = Management.objects.get(pk=request.data["management"]).attendant
            mail = [attendant.company_email]
            if (
                Management.objects.get(pk=request.data["management"]).area
                == "Gerencia de Operaciones"
            ):
                # Send an email to all the operation managers
                managers = User.objects.filter(
                    job_position__name="GERENTE DE OPERACIONES"
                )
                mail = [
                    manager.company_email
                    for manager in managers
                    if manager.company_email
                ]
                response.data["attendants"] = [
                    {"Name": manager.get_full_name()} for manager in managers
                ]
            if not mail:
                mail_admins(
                    "Error al enviar PQRS",
                    f"El usuario {attendant} no tiene un correo asignado.",
                )
                response.status_code = (
                    status.HTTP_200_OK
                )  # Don't send a 201 to fail tests
                return response
            send_mail(
                "Nueva PQRS",
                f"Se ha creado una nueva PQRS: {request.data['description']}",
                None,
                mail,
            )
        return response
