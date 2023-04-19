from django.db import models

# Create your models here.


class users(models.Model):
    national_id = models.CharField(max_length=45, primary_key=True)
    username = models.CharField(max_length=45)
    email_cyc = models.EmailField(max_length=100)
    extension = models.IntegerField(unique=True, null=True)
    id_agent = models.IntegerField(unique=True, null=True)
    role = models.CharField(max_length=10, choices=[
        ('Admin', 'Admin'),
        ('Analist', 'Analista'),
        ('RH', 'Recursos humanos'),
        ('User', 'Usuario')
    ])
    state = models.BooleanField()
