"""Serializers for the payslip model. """

from rest_framework import serializers
from services.serializers import CurrencyFormattedField
from .models import Payslip


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
    apsalpen = CurrencyFormattedField()
    additional_deductions = CurrencyFormattedField()
    total_deductions = CurrencyFormattedField()
    net_pay = CurrencyFormattedField()

    class Meta:
        """Meta class for the serializer."""

        model = Payslip
        fields = "__all__"
        read_only_fields = ("id", "created_at")
