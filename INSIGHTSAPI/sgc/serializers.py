"""Serializers for the SGC app. """
import magic
from rest_framework import serializers
from .models import SGCFile, SGCArea


class SGCAreaSerializer(serializers.ModelSerializer):
    """Serializer for the Task model."""

    class Meta:
        """Meta class for the Task serializer."""

        model = SGCArea
        fields = "__all__"


class SGCFileSerializer(serializers.ModelSerializer):
    """Serializer for the Task model."""

    file = serializers.FileField()
    area = serializers.SlugRelatedField(
        queryset=SGCArea.objects.all(), slug_field="name"
    )

    """Serializer for the Task model."""

    class Meta:
        """Meta class for the Task serializer."""

        model = SGCFile
        fields = "__all__"

    def validate_file(self, value):
        """
        Custom validation method to capture model validation errors.
        """
        valid_types = [
            "Microsoft Word 2007+",
            "PDF document",
            "Microsoft PowerPoint 2007+",
            "Microsoft Excel 2007+",
            "Microsoft Word 97-2003",
        ]
        if value.size > 10000000:
            raise serializers.ValidationError("El archivo no puede pesar mas de 10MB")
        mime = magic.Magic()
        file_type = mime.from_buffer(value.read())  # Read a small portion of the file
        if "PDF document" in file_type:
            file_type = "PDF document"
        value.seek(0)  # Reset the file pointer to the beginning for further use

        if not file_type in valid_types:
            raise serializers.ValidationError(
                "Formato de archivo no válido. Se aceptan los siguientes tipos: .docx, .pdf, .pptx, .xlsx, .doc"
            )
        return value
