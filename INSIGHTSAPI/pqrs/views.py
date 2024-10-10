"""This module contains the PQRS viewset."""

import logging

from django.core.mail import mail_admins, send_mail
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView

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
            if not attendant.company_email:
                mail_admins(
                    "Error al enviar PQRS",
                    f"El usuario {attendant} no tiene un correo asignado.",
                )
                return response
            send_mail(
                "Nueva PQRS",
                f"Se ha creado una nueva PQRS: {request.data['description']}",
                None,
                [attendant.company_email],
            )
        return response
