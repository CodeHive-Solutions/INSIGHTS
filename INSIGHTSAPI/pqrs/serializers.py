"""This file contains the serializers for the PQRS model."""
from os import read
from rest_framework import serializers
from .models import Complaint, Congratulation, Suggestion, Other
from users.models import User
from hierarchy.models import Area


class BasePQRSSerializer(serializers.ModelSerializer):
    """Base serializer for PQRS models."""

    area = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_at = serializers.ReadOnlyField()
    resolution_date = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField(default="PENDING")

    class Meta:
        """Meta class to map serializer's fields with the model fields."""

        fields = "__all__"

    def create(self, validated_data):
        name = self.context["request"].data["name"].split("-")
        firstname = name[0].strip()
        lastname = name[1].strip()
        user = User.objects.filter(first_name=firstname, last_name=lastname).first()
        if not user:
            raise serializers.ValidationError(
                {"error": f"El usuario {firstname, lastname} no existe."}
            )
        validated_data["area"] = Area.objects.get(name=user.area)
        # validated_data[
        # "area"
        # ] = user.area  # Assign the user's area to the Complaint's area
        # area = Area.objects.get(name=validated_data["name"].split("-")[0])
        # if not area:
        # raise serializers.ValidationError(
        # {"error": f"El área {validated_data['name']} no existe."}
        # )
        # validated_data["area"] = area
        return super().create(validated_data)


class ComplaintSerializer(BasePQRSSerializer):
    """Serializer for the Complaint model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Complaint


class CongratulationSerializer(BasePQRSSerializer):
    """Serializer for the Congratulation model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Congratulation


class SuggestionSerializer(BasePQRSSerializer):
    """Serializer for the Suggestion model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Suggestion


class OtherSerializer(BasePQRSSerializer):
    """Serializer for the Other model."""

    class Meta(BasePQRSSerializer.Meta):
        """Meta class to map fields with her model."""

        model = Other
