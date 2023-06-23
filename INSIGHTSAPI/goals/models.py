from django.db import models
from django.utils import timezone
from simple_history.models import HistoricalRecords

# class Goal(models.Model):
#     campaign = models.CharField(max_length=100, primary_key=True)
#     value = models.FloatField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     history = HistoricalRecords(excluded_fields=['created_at'])

#     def __str__(self):
#         return self.campaign

class Goals(models.Model):
    cedula = models.CharField(max_length=100, primary_key=True)
    job_title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    campaign = models.CharField(max_length=100)
    criteria = models.CharField(max_length=100)
    quantity = models.CharField(max_length=20)
    result = models.CharField(max_length=10)
    quality = models.CharField(max_length=10)
    evaluation = models.CharField(max_length=10)
    clean_desk = models.CharField(max_length=10)
    total = models.CharField(max_length=10)
    accepted_at = models.DateTimeField(null=True)
    accepted_execution_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(null=True)
    accepted_execution = models.BooleanField(null=True)
    coordinator = models.CharField(max_length=100, null=True)
    history = HistoricalRecords(excluded_fields=['created_at'])

    def pre_create_historical_record(self):
        record = super().pre_create_historical_record()
        record.history_date = timezone.now()
        record.save()
        return record

    def __str__(self):
        return self.name