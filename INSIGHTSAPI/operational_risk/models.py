"""Models for operational risk app."""
from django.db import models


class Process(models.Model):
    """Model definition for operational processes a look up table."""

    name = models.CharField(max_length=100)


class EventClass(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)


class Level(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)


class Events(models.Model):
    """Model definition for operational events."""

    start_date = models.DateField()
    end_date = models.DateField()
    discovery_date = models.DateField()
    accounting_date = models.DateField()
    currency = models.CharField(max_length=100)
    # choices={"USD", "COP"}
    quantity = models.IntegerField()
    recovered_quantity = models.IntegerField()
    recovered_quantity_by_insurance = models.IntegerField()
    event_class = models.ForeignKey(EventClass, on_delete=models.CASCADE)
    reported_by = models.CharField(max_length=100)
    # Also called classification
    critical = models.BooleanField()
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    plan = models.CharField(max_length=100)
    event = models.CharField(max_length=100)
    public_accounts_affected = models.CharField(max_length=100)
    process = models.ForeignKey(Process, on_delete=models.CASCADE)
    lost_type = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    product_line = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    date_of_closure = models.DateField()
    learning = models.CharField(max_length=200)
