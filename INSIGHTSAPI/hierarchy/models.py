from django.db import models

class management(models.Model):
    name = models.CharField(max_length=100)

class area(models.Model):
    name = models.CharField(max_length=100)