from PIL import Image
from rest_framework import serializers

from .models import Banner


class BannerSerializer(serializers.ModelSerializer):

    def validate_image(self, value):
        """Check if the image is 1280x720 pixels."""
        image = Image.open(value)
        if image.width != 1280 and image.height != 720:
            raise serializers.ValidationError(
                "La imagen debe tener un tamaño de 1280x720 píxeles."
            )
        return value

    class Meta:
        model = Banner
        fields = "__all__"
