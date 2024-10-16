"""This file contains the models for the goals app."""

from typing import Iterable

from django.db import models
from django.utils import timezone
from simple_history.models import HistoricalRecords


class Goals(models.Model):
    """Represents a goal associated with an individual's cedula."""

    cedula = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    job_title_goal = models.CharField(max_length=100)
    job_title_execution = models.CharField(max_length=100, null=True)
    campaign_goal = models.CharField(max_length=100)
    campaign_execution = models.CharField(max_length=100, null=True)
    coordinator_goal = models.CharField(max_length=100)
    coordinator_execution = models.CharField(max_length=100, null=True)
    criteria_goal = models.CharField(max_length=100)
    criteria_execution = models.CharField(max_length=100, null=True)
    quantity_goal = models.CharField(max_length=20)
    quantity_execution = models.CharField(max_length=20, null=True)
    result = models.CharField(max_length=10, blank=True)
    quality = models.CharField(max_length=10, blank=True)
    evaluation = models.CharField(max_length=10, blank=True)
    clean_desk = models.CharField(max_length=10, blank=True)
    total = models.CharField(max_length=10, blank=True)
    table_goal = models.CharField(max_length=50, null=True)
    goal_date = models.CharField(max_length=20)
    execution_date = models.CharField(max_length=20)
    observation_goal = models.CharField(max_length=350, null=True)
    observation_execution = models.CharField(max_length=350, null=True)
    accepted = models.BooleanField(null=True)
    accepted_at = models.DateTimeField(null=True)
    accepted_execution = models.BooleanField(null=True)
    accepted_execution_at = models.DateTimeField(null=True)
    status_goal = models.BooleanField(default=None, null=True)
    status_execution = models.BooleanField(default=None, null=True)
    last_update = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(excluded_fields=["last_update"])

    def save(self, *args, **kwargs):
        for field in self._meta.fields:
            # Check if the field is a CharField or TextField
            if (
                isinstance(field, (models.CharField, models.TextField))
                and field.name != "password"
                and self.__dict__[field.name]
                and isinstance(getattr(self, field.attname), str)
            ):
                setattr(self, field.attname, getattr(self, field.attname).upper())
        super(Goals, self).save(*args, **kwargs)

    def pre_create_historical_record(self):
        """This method is used to save the date of the historical record."""
        record = super().pre_create_historical_record()  # type: ignore
        record.history_date = timezone.now()
        record.save()
        return record

    def __str__(self):
        """This method is used to return the name of the goal."""
        return str(self.name)


class TableInfo(models.Model):
    """This class represents the table info model."""

    name = models.CharField(max_length=50)
    fringe = models.CharField(max_length=100)
    diary_goal = models.IntegerField()
    days = models.CharField(max_length=350)
    month_goal = models.IntegerField()
    hours = models.IntegerField()
    collection_account = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name)

    def pre_create_historical_record(self):
        """This method is used to save the date of the historical record."""
        record = super().pre_create_historical_record()  # type: ignore
        record.history_date = timezone.now()
        record.save()
        return record


# class TableName(models.Model):
# name = models.CharField(max_length=50, primary_key=True)

# def __str__(self):
# return self.name
