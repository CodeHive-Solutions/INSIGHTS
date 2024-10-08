"""This module contains the PQRS viewset."""

import logging
import sys

from django.conf import settings
from django.core.mail import EmailMessage, mail_admins
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Complaint, Congratulation, Other, Suggestion
from .serializers import (
    ComplaintSerializer,
    CongratulationSerializer,
    OtherSerializer,
    SuggestionSerializer,
)

logger = logging.getLogger("requests")


class NoGetModelViewSet(viewsets.ModelViewSet):
    """A custom ModelViewSet that disables the GET operation."""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Disable the GET operation."""
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def list(self, request, *args, **kwargs):
        """Disable the list operation."""
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        """Disable the retrieve operation."""
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        """Save the post data when creating a new model instance."""
        if not "area" in self.request.data:
            return Response({"error": "El area es requerida"}, status=400)
        if not "description" in self.request.data:
            return Response({"error": "La descripción es requerida"}, status=400)
        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            options = {
                "TEST": settings.EMAIL_FOR_TEST,
                "EJECUTIVO": "PABLO.CASTANEDA@CYC-BPO.COM",
                "GERENCIA GENERAL": "CESAR.GARZON@CYC-BPO.COM",
                "GERENCIA DE RIESGO Y CONTROL INTERNO": "ANGELICA.RINCON@CYC-BPO.COM",
                "GERENCIA GESTIÓN HUMANA": "JEANNETH.PINZON@CYC-BPO.COM",
                "GERENCIA DE PLANEACIÓN": "ANGELA.DURAN@CYC-BPO.COM",
                "GERENCIA ADMINISTRATIVA": "MELIDA.SANDOVAL@CYC-BPO.COM",
                "GERENCIA DE LEGAL Y RIESGO": "DIEGO.GONZALEZ@CYC-BPO.COM",
                "GERENCIA DE OPERACIONES": "ADRIANA.PAEZ@CYC-BPO.COM",
                "RECURSOS FÍSICOS": "",
            }
            email = options.get(self.request.data["area"].upper())
            if not email:
                mail_admins(
                    "Error en PQRS",
                    f"El area {self.request.data['area']} no tiene un correo asociado.",
                )
                return Response(
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    data=f"El area {self.request.data['area']} no tiene un correo asociado.",
                )
            if settings.DEBUG or "test" in sys.argv:
                cc_emails = ["juan.carreno@cyc-bpo.com"]
            else:
                cc_emails = ["marlon.botero@cyc-bpo.com"]
            email = EmailMessage(
                "Nueva PQRS",
                f"Se ha creado una nueva PQRS: {request.data['description']}",
                None,
                [email],
                cc=cc_emails,
            )
            email.send()
        return response


class ComplaintViewSet(NoGetModelViewSet):
    """This class represents the Complaint viewset."""

    serializer_class = ComplaintSerializer
    queryset = Complaint.objects.all()


class CongratulationViewSet(NoGetModelViewSet):
    """This class represents the Congratulation viewset."""

    serializer_class = CongratulationSerializer
    queryset = Congratulation.objects.all()


class SuggestionViewSet(NoGetModelViewSet):
    """This class represents the Suggestion viewset."""

    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all()


class OtherViewSet(NoGetModelViewSet):
    """This class represents the Other viewset."""

    serializer_class = OtherSerializer
    queryset = Other.objects.all()
