import os
from django.db import models
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile


class Banner(models.Model):
    order = models.IntegerField()
    title = models.CharField(max_length=100)
    link = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to="carousel_images/banners/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.pk:  # only if the object is new
            Banner.objects.filter(order__gte=self.order).update(
                order=models.F("order") + 1
            )
        super().save(*args, **kwargs)
        if self.image:
            self.resize_and_convert_to_webp()

    def delete(self, *args, **kwargs):
        Banner.objects.filter(order__gt=self.order).update(order=models.F("order") - 1)
        # Delete the image file
        self.image.delete(save=False)
        return super().delete(*args, **kwargs)

    def resize_and_convert_to_webp(self):
        img = Image.open(self.image)
        img = img.convert("RGB")  # Ensure it's in RGB mode (necessary for .webp)

        # Resize the image if it exceeds the max width and height
        max_width, max_height = 1280, 720
        img.thumbnail((max_width, max_height))  # Maintain aspect ratio and resize

        # Create a BytesIO buffer to store the converted image
        img_io = BytesIO()
        img.save(
            img_io, format="WEBP", quality=85
        )  # Save image in .webp format with quality 85

        # Set the new image filename with a .webp extension
        image_name, _ = os.path.splitext(self.image.name)
        webp_image_name = image_name + ".webp"

        # Save the converted image back to the image field
        self.image.save(webp_image_name, ContentFile(img_io.getvalue()), save=False)

        # Save the model again to persist the changes
        super().save()
