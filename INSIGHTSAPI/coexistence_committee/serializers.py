from rest_framework import serializers

from .models import Complaint, Reason


class ComplaintSerializer(serializers.ModelSerializer):
    """Serializer for the Complaint model."""

    def to_representation(self, instance):
        """Return the representation of the instance."""
        representation = super().to_representation(instance)
        representation["reason"] = instance.reason.reason
        return representation

    class Meta:
        """Meta class to map fields with her model."""

        model = Complaint
        fields = "__all__"


class ReasonSerializer(serializers.ModelSerializer):
    """Serializer for the Reason model."""

    class Meta:
        """Meta class to map fields with her model."""

        model = Reason
        fields = "__all__"
