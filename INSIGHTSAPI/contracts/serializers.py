"""This module defines the serializers for the contracts app. """
from rest_framework import serializers
from simple_history.models import HistoricalRecords
from contracts.models import Contract


class ContractSerializer(serializers.ModelSerializer):
    """Serializer for the Contract model."""

    class Meta:
        """Meta class for the ContractSerializer."""

        model = Contract
        fields = "__all__"
        history = HistoricalRecords()
