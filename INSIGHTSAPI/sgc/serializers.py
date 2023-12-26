"""Serializers for the SGC app. """
from hierarchy.models import Area
from rest_framework import serializers
from .models import SGCFile


class SGCFileSerializer(serializers.ModelSerializer):
    """Serializer for the Task model."""

    area = serializers.StringRelatedField(read_only=True)
    file = serializers.FileField(write_only=True)

    """Serializer for the Task model."""

    class Meta:
        """Meta class for the Task serializer."""

        model = SGCFile
        fields = "__all__"

    def create(self, validated_data):
        if "area" in self.context["request"].data and not isinstance(
            self.context["request"].data["area"], int
        ):
            print("string")
            validated_data["area"] = Area.objects.get(
                name=self.context["request"].data["area"]
            )
        elif "area" in self.context["request"].data and isinstance(
            self.context["request"].data["area"], int
        ):
            print("integer")
            validated_data["area"] = Area.objects.get(
                id=self.context["request"].data["area"]
            )
        else:
            print("no area")
            raise serializers.ValidationError(
                "El campo area es requerido para crear un archivo."
            )
        return super().create(validated_data)
