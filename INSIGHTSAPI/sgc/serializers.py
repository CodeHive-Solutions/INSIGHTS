"""Serializers for the SGC app. """
from rest_framework import serializers
from .models import SGCFile
from hierarchy.models import Area


class SGCFileSerializer(serializers.ModelSerializer):
    area = serializers.PrimaryKeyRelatedField(read_only=True)

    """Serializer for the Task model."""

    class Meta:
        """Meta class for the Task serializer."""

        model = SGCFile
        fields = "__all__"

    def create(self, validated_data):
        validated_data["area"] = Area.objects.get(
            name=self.context["request"].data["area"]
        )
        return super().create(validated_data)
