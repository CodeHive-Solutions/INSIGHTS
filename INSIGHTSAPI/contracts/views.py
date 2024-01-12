"""This module defines the views for the contracts app."""
from rest_framework import viewsets
from services.permissions import DjangoModelViewPermissions
from .models import Contract
from .serializers import ContractSerializer


# Create your views here.
class ContractViewSet(viewsets.ModelViewSet):
    """ViewSet for the Contract model."""

    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [DjangoModelViewPermissions]
