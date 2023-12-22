"""This file contains the serializers for the PQRS model."""
from os import read
from rest_framework import serializers
from .models import Complaint, Congratulation, Suggestion, Other
from hierarchy.models import Area


class BasePQRSSerializer(serializers.ModelSerializer):
    """Base serializer for PQRS models."""

    area = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_at = serializers.ReadOnlyField()
    resolution_date = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField(default="PENDING")

    class Meta:
        """Meta class to map serializer's fields with the model fields."""

        fields = "__all__"

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data[
            "area"
        ] = user.area  # Assign the user's area to the Complaint's area
        return super().create(validated_data)


class ComplaintSerializer(BasePQRSSerializer):
    """Serializer for the Complaint model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Complaint


class CongratulationSerializer(BasePQRSSerializer):
    """Serializer for the Congratulation model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Congratulation


class SuggestionSerializer(BasePQRSSerializer):
    """Serializer for the Suggestion model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Suggestion


class OtherSerializer(BasePQRSSerializer):
    """Serializer for the Other model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Other
