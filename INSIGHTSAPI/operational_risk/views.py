"""This module contains the views for the operational_risk app."""
from rest_framework import viewsets
from rest_framework import permissions
from services.permissions import CustomGetDjangoModelViewPermissions
from .serializers import EventsSerializer
from .models import Events


class EventsViewSet(viewsets.ModelViewSet):
    """API endpoint that allows events to be viewed or edited."""

    queryset = Events.objects.all()
    serializer_class = EventsSerializer
    permission_classes = [permissions.IsAuthenticated, CustomGetDjangoModelViewPermissions]
