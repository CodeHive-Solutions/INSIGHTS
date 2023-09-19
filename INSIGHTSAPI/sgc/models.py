from django.db import models

class Files(models.Model):
    area = models.ForeignKey('hierarchy.area', on_delete=models.DO_NOTHING)
    sub_type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to='files/')