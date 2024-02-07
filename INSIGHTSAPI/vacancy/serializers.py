"""Serializers for vacancy app"""
import logging
from io import BytesIO
from PIL import Image
from numpy import source
from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Vacancy, Reference

logger = logging.getLogger("requests")

MAX_SIZE = 10000000


def validate_and_convert_to_webp(value):
    """Validates that the uploaded file is valid."""
    # Just allow webp
    if value.size > MAX_SIZE:
        raise ValidationError("El archivo no puede pesar mas de 10MB")
    try:
        img = Image.open(BytesIO(value.read()))
        if img.format != "WEBP":
            # convert to webp
            webp_bytes = BytesIO()
            img.save(webp_bytes, "WEBP")
            value.file = webp_bytes
            # print(value.file)
            value.size = webp_bytes.tell()
    except Exception as e:
        logger.exception(e)
        raise serializers.ValidationError("El archivo no es una imagen valida") from e


class VacancySerializer(serializers.ModelSerializer):
    """Serializer for the Vacancy model"""
    is_active = serializers.BooleanField(default=True)

    class Meta:
        """Meta class for the VacancySerializer"""

        model = Vacancy
        fields = "__all__"

    def validate_image(self, value):
        """Validates the image field"""
        validate_and_convert_to_webp(value)
        return value
    
    def is_valid(self, raise_exception=False):
        print("is_valid")
        print(self.initial_data)
        print(self.fields)
        response = super().is_valid()
        print("VALIDADO")
        print(self.validated_data)


class ReferenceSerializer(serializers.ModelSerializer):
    """Serializer for the Reference model"""

    made_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    #Show who create it
    created_by = serializers.SerializerMethodField()
    vacancy = serializers.SlugRelatedField(slug_field="name", queryset=Vacancy.objects.all())

    def get_created_by(self, obj):
        """Get the user who created the reference"""
        return obj.made_by.get_full_name().title()

    class Meta:
        """Meta class for the ReferenceSerializer"""

        model = Reference
        fields = "__all__"
