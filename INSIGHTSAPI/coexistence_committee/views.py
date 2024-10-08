from django.core.mail import send_mail
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.models import User

from .models import Complaint
from .serializers import ComplaintSerializer


# Create your views here.
class ComplaintViewSet(viewsets.ModelViewSet):
    """A viewset for viewing and editing complaints."""

    serializer_class = ComplaintSerializer
    queryset = Complaint.objects.all()
    permission_classes = [IsAuthenticated]

    def _check_committee_membership(self, request):
        """Helper method to check if the user is part of the coexistence committee."""
        if not request.user.groups.filter(name="coexistence_committee").exists():
            return Response(
                {"error": "No tienes permisos para acceder a esta información"},
                status=403,
            )
        return None

    def list(self, request, *args, **kwargs):
        """This method is used to list all complaints."""
        # Check if the user is a member of the coexistence committee
        permission_error = self._check_committee_membership(request)
        if permission_error:
            return permission_error
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        """This method is used to retrieve a complaint."""
        # Check if the user is a member of the coexistence committee
        permission_error = self._check_committee_membership(request)
        if permission_error:
            return permission_error
        response = super().retrieve(request, *args, **kwargs)
        return response

    def create(self, request, *args, **kwargs):
        """This method is used to create a complaint."""
        # When a complaint is created, an email is sent to the attendant
        response = super().create(request, *args, **kwargs)
        complaint = response.data
        sst_mails = [
            user.email for user in User.objects.filter(groups__name="SST") if user.email
        ]
        if not sst_mails:
            return Response({"error": "No hay usuarios en el grupo SST"}, status=500)

        send_mail(
            "New complaint",
            f"New complaint with reason: {complaint['reason']}",
            None,
            sst_mails,
        )
        return response
