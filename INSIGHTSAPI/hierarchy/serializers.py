from rest_framework import serializers
from .models import Area


class AreaSerializer(serializers.ModelSerializer):
    """Serializer for the Area model."""

    class Meta:
        """Meta class to map fields with her model."""

        model = Area
        fields = "__all__"
