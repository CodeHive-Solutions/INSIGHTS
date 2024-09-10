from django.db import models


class Banner(models.Model):
    title = models.CharField(max_length=100)
    link = models.URLField(blank=True, null=True)
    active = models.BooleanField(default=True)
    image = models.ImageField(upload_to="carousel_images/banners/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
