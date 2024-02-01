"""This module contains the views for the operational_risk app."""
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import EventsSerializer
from .models import Events

