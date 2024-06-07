"""Serializers for the vacation app."""

from rest_framework import serializers
from users.models import User
from notifications.utils import create_notification
from .models import VacationRequest


class VacationRequestSerializer(serializers.ModelSerializer):
    """Serializer for the vacation request model."""

    start_date = serializers.DurationField
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    uploaded_by = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        """Meta class for the serializer."""

        model = VacationRequest
        fields = [
            "id",
            "user",
            "start_date",
            "end_date",
            "request_file",
            "uploaded_at",
            "hr_approved",
            "hr_approved_at",
            "uploaded_by",
        ]
        read_only_fields = [
            "uploaded_at" "hr_approved",
            "hr_approved_at",
            "uploaded_by",
        ]

    def to_representation(self, instance):
        """Return the representation of the vacation request."""
        data = super().to_representation(instance)
        data["user"] = instance.user.get_full_name()
        data["uploaded_by"] = instance.uploaded_by.get_full_name()
        return data

    def validate(self, attrs):
        """Validate the dates of the vacation request."""
        if "start_date" in attrs and "end_date" in attrs:
            if attrs["start_date"] > attrs["end_date"]:
                raise serializers.ValidationError(
                    "End date cannot be before start date."
                )
        uploaded_by = (
            self.instance.uploaded_by if self.instance else self.context["request"].user
        )
        if attrs["user"] == uploaded_by:
            raise serializers.ValidationError(
                "No puedes subir solicitudes para ti mismo."
            )
        if uploaded_by.job_position.rank >= attrs["user"].job_position.rank:
            raise serializers.ValidationError(
                "No puedes crear una solicitud para este usuario."
            )
        return attrs

    def create(self, validated_data):
        """Create the vacation request."""
        validated_data["uploaded_by"] = self.context["request"].user
        vacation_request = super().create(validated_data)
        create_notification(
            user=validated_data["user"],
            title="Nueva solicitud de vacaciones",
            message="Se ha creado una nueva solicitud de vacaciones para ti.",
        )
        return vacation_request

    def update(self, instance, validated_data):
        """Update the vacation request."""
        allowed_fields = [
            "hr_approved",
        ]
        for field, value in validated_data.items():
            if field in allowed_fields:
                setattr(instance, field, value)
        instance.save()
        return instance
