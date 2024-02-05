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


    class Meta:
        """Meta class for EventsSerializer."""

        model = Events
        fields = "__all__"
