"""Custom serializers used in the project. """
from rest_framework import serializers
from django.utils.formats import number_format


class CurrencyFormattedField(serializers.Field):
    """Custom serializer field to format currency."""

    def to_representation(self, value):
        # Format the value as currency
        return number_format(value, use_l10n=True)

    def to_internal_value(self, data):
        # Convert the value back to a float
        return float(data)
