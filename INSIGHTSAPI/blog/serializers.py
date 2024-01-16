"""This module defines the serializers for the blog app. """
from rest_framework import serializers
from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for the Contract model."""

    class Meta:
        """Meta class for the ContractSerializer."""

        model = BlogPost
        fields = "__all__"
