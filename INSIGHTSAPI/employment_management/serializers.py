"""This module contains the serializers for the employment_management app. """

from rest_framework import serializers
from .models import EmploymentCertification


class EmploymentCertificationSerializer(serializers.ModelSerializer):
    """Employment certification serializer."""

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["cedula"] = instance.user.cedula
        return representation

    class Meta:
        model = EmploymentCertification
        fields = "__all__"
