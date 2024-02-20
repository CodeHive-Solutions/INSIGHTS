"""Custom serializers used in the project. """

from rest_framework import serializers
from .models import Payslip
from django.utils.formats import number_format


class CurrencyFormattedField(serializers.Field):
    """Custom serializer field to format currency."""

    def to_representation(self, value):
        # Format the value as currency
        return number_format(value, use_l10n=True)

    def to_internal_value(self, data):
        # Convert the value back to a float
        try:
            return float(data)
        except ValueError as e:
            raise serializers.ValidationError("Invalid value for a float", data) from e


class PayslipSerializer(serializers.ModelSerializer):
    """Serializer for the payslip model."""

    salary = CurrencyFormattedField()
    biweekly_period = CurrencyFormattedField()
    transport_allowance = CurrencyFormattedField()
    bonus_paycheck = CurrencyFormattedField()
    gross_earnings = CurrencyFormattedField()
    healthcare_contribution = CurrencyFormattedField()
    pension_contribution = CurrencyFormattedField()
    tax_withholding = CurrencyFormattedField()
    additional_deductions = CurrencyFormattedField()
    total_deductions = CurrencyFormattedField()
    net_pay = CurrencyFormattedField()

    class Meta:
        """Meta class for the serializer."""

        model = Payslip
        fields = "__all__"
        read_only_fields = ("id", "created_at")
