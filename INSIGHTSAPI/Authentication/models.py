from django.db import models
from django.contrib.auth.models import AbstractUser

class users(models.Model):
    national_id = models.CharField(max_length=45)
    username = models.CharField(max_length=45)
    email_cyc = models.EmailField(max_length=100)
    extension = models.IntegerField(unique=True, null=True)
    id_agent = models.IntegerField(unique=True, null=True)
    state = models.BooleanField()
