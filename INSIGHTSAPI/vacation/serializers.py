"""Serializers for the vacation app."""

from datetime import datetime
from rest_framework import serializers
from users.models import User
from distutils.util import strtobool
from .utils import is_working_day, get_working_days
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
            "created_at",
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
            "created_at",
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
        # Check if is a creation or an update
        if not self.instance:
            # Creation
            created_at = datetime.now()
            request = self.context["request"]
            if request.data.get("mon_to_sat") is None:
                raise serializers.ValidationError(
                    "Debes especificar si trabajas los sábados."
                )
            else:
                try:
                    mon_to_sat = bool(strtobool(request.data["mon_to_sat"]))
                except ValueError:
                    raise serializers.ValidationError(
                        "Debes especificar si trabajas los sábados o no."
                    )
            if not is_working_day(attrs["start_date"], mon_to_sat):
                raise serializers.ValidationError(
                    "No puedes iniciar tus vacaciones un día no laboral."
                )
            if not is_working_day(attrs["end_date"], mon_to_sat):
                raise serializers.ValidationError(
                    "No puedes terminar tus vacaciones un día no laboral."
                )
            if request.data["mon_to_sat"] == True:
                if attrs["start_date"].weekday() == 5:
                    raise serializers.ValidationError(
                        "No puedes iniciar tus vacaciones un sábado."
                    )
            if (
                get_working_days(attrs["start_date"], attrs["end_date"], mon_to_sat)
                > 15
            ):
                raise serializers.ValidationError(
                    "No puedes solicitar más de 15 días de vacaciones."
                )
            if (
                created_at.day > 20
                and created_at.month + 1 == attrs["start_date"].month
            ):
                raise serializers.ValidationError(
                    "Después del día 20 no puedes solicitar vacaciones para el mes siguiente."
                )
            if (
                attrs["start_date"].month == created_at.month
                and attrs["start_date"].year == created_at.year
            ):
                raise serializers.ValidationError(
                    "No puedes solicitar vacaciones para el mes actual."
                )
            if attrs["start_date"] > attrs["end_date"]:
                raise serializers.ValidationError(
                    "La fecha de inicio no puede ser mayor a la fecha de fin."
                )
            if attrs["end_date"].weekday() == 6:
                raise serializers.ValidationError(
                    "No puedes terminar tus vacaciones un domingo."
                )
            uploaded_by = self.instance.uploaded_by if self.instance else request.user
            if attrs["user"] == uploaded_by and attrs["user"].job_position.rank <= 3:
                raise serializers.ValidationError(
                    "No puedes subir solicitudes para ti mismo."
                )
            if (
                attrs["user"].job_position.rank >= uploaded_by.job_position.rank
                and uploaded_by != attrs["user"]
            ):
                raise serializers.ValidationError(
                    "No puedes crear una solicitud para este usuario."
                )
        else:
            # Update
            if (
                self.instance.manager_approbation
                and "status" in attrs
                and attrs["status"] == "CANCELADA"
            ):
                raise serializers.ValidationError(
                    "No puedes cancelar una solicitud que ya ha sido aprobada por tu jefe."
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
