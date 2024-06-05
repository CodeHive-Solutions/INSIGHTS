"""Serializers for the vacation app."""

from rest_framework import serializers
from users.models import User
from notifications.utils import create_notification
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
        if attrs["user"] == attrs["uploaded_by"]:
            raise serializers.ValidationError(
                "No puedes subir solicitudes para ti mismo."
            )
        if attrs["uploaded_by"].job_position.rank >= attrs["user"].job_position.rank:
            raise serializers.ValidationError(
                "No puedes crear una solicitud para este usuario."
            )
        return attrs

    def create(self, validated_data):
        """Create the vacation request."""
        vacation_request = super().create(validated_data)
        create_notification(
            user=validated_data["user"],
            title="Nueva solicitud de vacaciones",
            message="Se ha creado una nueva solicitud de vacaciones para ti.",
        )
        return vacation_request
