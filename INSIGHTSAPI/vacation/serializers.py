"""Serializers for the vacation app."""

from rest_framework import serializers
from users.models import User
from .models import VacationRequest


class VacationRequestSerializer(serializers.ModelSerializer):
    """Serializer for the vacation request model."""

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    uploaded_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        """Meta class for the serializer."""

        model = VacationRequest
        fields = "__all__"

    def validate(self, attrs):
        """Validate the dates of the vacation request."""
        if attrs["start_date"] > attrs["end_date"]:
            raise serializers.ValidationError(
                "La fecha de inicio no puede ser mayor a la fecha de fin."
            )
        return attrs
