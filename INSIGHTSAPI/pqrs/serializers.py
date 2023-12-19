"""This file contains the serializers for the PQRS model."""
from rest_framework import serializers
from .models import Complaint  # Replace with the actual path to your model


class ComplaintSerializer(serializers.ModelSerializer):
    """This class represents the Complaint serializer."""

    class Meta:
        model = Complaint
        fields = "__all__"
