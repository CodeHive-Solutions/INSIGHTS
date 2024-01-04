from django.db import models
from simple_history.models import HistoricalRecords


# Create your models here.
class Contract(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    start_date = models.DateField()
    renovation_date = models.DateField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    monthly_cost = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DateField()
    contact = models.CharField(max_length=100)
    contact_telephone = models.CharField(max_length=20)
    civil_responsibility_policy = models.CharField(max_length=200)
    compliance_policy = models.CharField(max_length=200)
    insurance_policy = models.CharField(max_length=200)
    history = HistoricalRecords()
