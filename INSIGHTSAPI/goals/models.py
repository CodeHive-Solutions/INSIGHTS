from django.db import models
from django.utils import timezone
from simple_history.models import HistoricalRecords

class Goals(models.Model):
    cedula = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    campaign = models.CharField(max_length=100)
    coordinator = models.CharField(max_length=100)
    criteria = models.CharField(max_length=100)
    quantity = models.CharField(max_length=20)
    result = models.CharField(max_length=10, blank=True)
    quality = models.CharField(max_length=10, blank=True)
    evaluation = models.CharField(max_length=10, blank=True)
    clean_desk = models.CharField(max_length=10, blank=True)
    total = models.CharField(max_length=10, blank=True)
    # table_goal = models.ForeignKey('TableName', on_delete=models.DO_NOTHING, null=True)
    table_goal = models.CharField(max_length=50, null=True)
    goal_date = models.CharField(max_length=20)
    execution_date = models.CharField(max_length=20)
    observation = models.CharField(max_length=350,null=True)
    accepted = models.BooleanField(null=True)
    accepted_at = models.DateTimeField(null=True)
    accepted_execution = models.BooleanField(null=True)
    accepted_execution_at = models.DateTimeField(null=True)
    status = models.BooleanField(default=None, null=True)
    last_update = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(excluded_fields=['last_update'])
    def pre_create_historical_record(self):
        record = super().pre_create_historical_record() #type: ignore
        record.history_date = timezone.now()
        record.save()
        return record
    def __str__(self):
        return self.name

class TableInfo(models.Model):
    # name = models.ForeignKey('TableName', on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=50)
    fringe = models.CharField(max_length=100)
    diary_goal = models.IntegerField()
    days = models.CharField(max_length=350)
    month_goal = models.IntegerField()
    hours = models.IntegerField()
    collection_account = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return self.name

    def pre_create_historical_record(self):
        record = super().pre_create_historical_record() #type: ignore
        record.history_date = timezone.now()
        record.save()
        return record

# class TableName(models.Model):
    # name = models.CharField(max_length=50, primary_key=True)

    # def __str__(self):
        # return self.name