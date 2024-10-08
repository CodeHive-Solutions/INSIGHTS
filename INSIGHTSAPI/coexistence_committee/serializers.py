from rest_framework import serializers

from .models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):
    """Serializer for the Complaint model."""

    class Meta:
        """Meta class to map fields with her model."""

        model = Complaint
        fields = "__all__"
