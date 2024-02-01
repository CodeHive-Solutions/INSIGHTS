"""This file contains the serializers for the operational_risk app."""
from rest_framework import serializers
from .models import Events


class EventsSerializer(serializers.ModelSerializer):
    """Serializer for Events."""

    class Meta:
        """Meta class for EventsSerializer."""

        model = Events
        fields = "__all__"
