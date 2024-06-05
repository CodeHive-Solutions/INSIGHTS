# notifications/serializers.py
from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for the notification model."""

    class Meta:
        """Meta class for the serializer."""

        model = Notification
        fields = ["id", "title", "user", "message", "created_at", "read"]
        read_only_fields = ["id", "user", "created_at", "read"]
