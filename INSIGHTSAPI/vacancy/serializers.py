"""Serializers for vacancy app"""
from rest_framework import serializers
from .models import Vacancy, Reference


class VacancySerializer(serializers.ModelSerializer):
    """Serializer for the Vacancy model"""

    class Meta:
        """Meta class for the VacancySerializer"""

        model = Vacancy
        fields = "__all__"
