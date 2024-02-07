"""This file contains the serializers for the operational_risk app."""
from rest_framework import serializers
from .models import Events, EventClass, Level, Process, LostType, ProductLine


class EventsSerializer(serializers.ModelSerializer):
    """Serializer for Events."""
    event_class = serializers.SlugRelatedField(slug_field="name", queryset=EventClass.objects.all())
    level = serializers.SlugRelatedField(slug_field="name", queryset=Level.objects.all())
    process = serializers.SlugRelatedField(slug_field="name", queryset=Process.objects.all())
    lost_type = serializers.SlugRelatedField(slug_field="name", queryset=LostType.objects.all())
    product = serializers.SlugRelatedField(slug_field="name", queryset=ProductLine.objects.all())
    # critical = serializers.BooleanField()
    # status = serializers.BooleanField()

    def to_representation(self, instance):
        """Return the representation of the instance with the booleans in a human readable format and all her columns in uppercase."""
        representation = super().to_representation(instance)
        # representation["critical"] = "CRITICO" if instance.critical else "NO CRITICO"
        # representation["status"] = "ABIERTO" if instance.status else "CERRADO"
        for field in representation:
            if isinstance(representation[field], str):
                representation[field] = representation[field].upper()
        return representation

    class Meta:
        """Meta class for EventsSerializer."""

        model = Events
        fields = "__all__"
