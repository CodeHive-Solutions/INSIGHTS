"""This file contains the serializers for the PQRS model."""

from hierarchy.models import Area
from rest_framework import serializers

from .models import PQRS, Management


class ManagementSerializer(serializers.ModelSerializer):
    """Serializer for the Management model."""

    class Meta:
        """Meta class to map fields with her model."""

        model = Management
        fields = "__all__"


class PQRSSerializer(serializers.ModelSerializer):
    """Serializer for the PQRS model."""

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        """Meta class to map fields with her model."""

        model = PQRS
        fields = "__all__"
