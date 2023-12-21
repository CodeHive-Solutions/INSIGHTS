"""This module contains the PQRS viewset."""
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Complaint, Congratulation, Suggestion, Other
from services.emails import send_email
from .serializers import (
    ComplaintSerializer,
    CongratulationSerializer,
    SuggestionSerializer,
    OtherSerializer,
)
from django.db import connections
import logging


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
        user = self.request.user
        name = self.request.data["area"].split(" - ")[0].upper()
        request.data["area"] = user.area_id
        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            with connections["staffnet"].cursor() as cursor:
                cursor.execute(
                    "SELECT correo FROM personal_information WHERE nombre = %s",
                    (name,),
                )
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {"error": f"No se encontró el email de {name}"},
                        status=status.HTTP_404_NOT_FOUND,
                    )
                errors = send_email(
                    sender_user="mismetas",
                    subject="Nueva PQRS",
                    message=f"<p>El usuario {user.first_name} {user.last_name} ha creado una nueva PQRS: </p> {request.data['description']}",
                    to_emails=[row[0], "heibert.mogollon@cyc-bpo.com"],
                    bcc_emails=[
                        "juan.carreno@cyc-bpo.com",
                        "heibert.mogollon@gmail.com",
                    ],
                    save_message=False,
                    html_content=True,
                    email_owner="PQRS",
                    return_path="heibert.mogollon@cyc-bpo.com",
                )
                if errors:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
