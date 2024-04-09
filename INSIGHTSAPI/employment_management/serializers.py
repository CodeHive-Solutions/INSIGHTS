"""This module contains the serializers for the employment_management app. """

from rest_framework import serializers
from .models import EmploymentCertification


class EmploymentCertificationSerializer(serializers.ModelSerializer):
    """Employment certification serializer."""

    class Meta:
        model = EmploymentCertification
        fields = "__all__"