"""Serializers for the SGC app. """
from rest_framework import serializers
from .models import SGCFile

class SGCFileSerializer(serializers.ModelSerializer):
    """Serializer for the Task model."""
    class Meta:
        """Meta class for the Task serializer."""
        model = SGCFile
        fields = '__all__'
