"""Serializers for the SGC app. """
from rest_framework import serializers
from .models import SGCFile
from django.core.exceptions import ValidationError


class SGCFileSerializer(serializers.ModelSerializer):
    """Serializer for the Task model."""

    file = serializers.FileField(write_only=True)

    """Serializer for the Task model."""

    class Meta:
        """Meta class for the Task serializer."""

        model = SGCFile
        fields = "__all__"

    def validate(self, data):
        """
        Custom validation method to capture model validation errors.
        """
        instance = self.Meta.model(
            **data
        )  # Create a model instance with the provided data

        try:
            instance.full_clean()  # Trigger model validation
        except ValidationError as e:
            raise serializers.ValidationError(detail=e.message_dict)
        return data
