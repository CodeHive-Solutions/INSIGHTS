"""Serializers for the payslip model. """

from rest_framework import serializers
from .models import Payslip


class PayslipSerializer(serializers.ModelSerializer):
    """Serializer for the payslip model."""

    class Meta:
        """Meta class for the serializer."""

        model = Payslip
        fields = "__all__"
        read_only_fields = ("id", "created_at")
