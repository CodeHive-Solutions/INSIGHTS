from django.db import models


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
