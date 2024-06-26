"""Serializers for the vacation app."""

from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the vacation request model."""

    class Meta:
        """Meta class for the serializer."""

        model = User
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
        data.pop("request_file")
        data.pop("manager_approved_at")
        data.pop("hr_approved_at")
        data.pop("payroll_approved_at")
        return data
