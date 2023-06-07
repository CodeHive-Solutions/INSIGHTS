from django.db import models
from simple_history.models import HistoricalRecords

class Goal(models.Model):
    campaign = models.CharField(max_length=100, primary_key=True)
    value = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.campaign

class PersonGoals(models.Model):
    cedula = models.CharField(max_length=100, primary_key=True)
    job_title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    campaign = models.CharField(max_length=100)
    result = models.CharField(max_length=10)
    quality = models.CharField(max_length=10)
    evaluation = models.CharField(max_length=10)
    clean_desk = models.CharField(max_length=10)
    total = models.CharField(max_length=10)

    def __str__(self):
        return self.name