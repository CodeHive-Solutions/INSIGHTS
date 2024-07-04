"""Serializers for the vacation app."""

from rest_framework import serializers
from users.models import User
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
            "manager_approbation",
            "manager_approved_at",
            "hr_approbation",
            "hr_approved_at",
            "payroll_approbation",
            "payroll_approved_at",
            "uploaded_by",
            "status",
            "comment",
        ]
        read_only_fields = [
            "manager_approved_at",
            "hr_approved_at",
            "payroll_approved_at",
            "uploaded_by",
            "uploaded_at",
        ]

    def to_representation(self, instance):
        """Return the representation of the vacation request."""
        data = super().to_representation(instance)
        data["user"] = instance.user.get_full_name()
        data["uploaded_by"] = instance.uploaded_by.get_full_name()
        data.pop("manager_approved_at")
        data.pop("hr_approved_at")
        data.pop("payroll_approved_at")
        return data

    def validate(self, attrs):
        """Validate the dates of the vacation request."""
        if "start_date" in attrs and "end_date" in attrs:
            if attrs["start_date"] > attrs["end_date"]:
                raise serializers.ValidationError(
                    "La fecha de inicio no puede ser mayor a la fecha de fin."
                )
        uploaded_by = (
            self.instance.uploaded_by if self.instance else self.context["request"].user
        )
        if "user" in attrs:
            if attrs["user"] == uploaded_by:
                raise serializers.ValidationError(
                    "No puedes subir solicitudes para ti mismo."
                )
            if attrs["user"].job_position.rank >= uploaded_by.job_position.rank:
                raise serializers.ValidationError(
                    "No puedes crear una solicitud para este usuario."
                )
        return attrs

    def create(self, validated_data):
        """Create the vacation request."""
        # Remove the approbation fields from the validated data
        validated_data.pop("hr_approbation", None)
        validated_data.pop("payroll_approbation", None)
        validated_data.pop("manager_approbation", None)
        validated_data["uploaded_by"] = self.context["request"].user
        vacation_request = super().create(validated_data)
        return vacation_request

    def update(self, instance, validated_data):
        """Update the vacation request."""
        allowed_fields = [
            "manager_approbation",
            "manager_approved_at",
            "hr_approbation",
            "hr_approved_at",
            "payroll_approbation",
            "payroll_approved_at",
            "status",
            "comment",
        ]
        for field, value in validated_data.items():
            if field in allowed_fields:
                setattr(instance, field, value)
        instance.save()
        return instance
