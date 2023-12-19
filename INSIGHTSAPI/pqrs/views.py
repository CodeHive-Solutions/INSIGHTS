"""This module contains the PQRS viewset."""
from rest_framework import viewsets
from rest_framework import permissions
from .models import Complaint
from .serializers import ComplaintSerializer


class ComplaintViewSet(viewsets.ModelViewSet):
    """This class represents the Complaint viewset."""

    serializer_class = ComplaintSerializer
    queryset = Complaint.objects.all()
