"""Models for operational risk app."""

from django.db import models


class Process(models.Model):
    """Model definition for operational processes a look up table."""

    name = models.CharField(max_length=100)

    def __str__(self):
        """Return the name of the process."""
        return str(self.name)


class EventClass(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)

    def __str__(self):
        """Return the name of the event class."""
        return str(self.name)


class Level(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)

    def __str__(self):
        """Return the name of the level."""
        return str(self.name)


class LostType(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)

    def __str__(self):
        """Return the name of the lost type."""
        return str(self.name)


class ProductLine(models.Model):
    """Model definition for operational event classes a look up table."""

    name = models.CharField(max_length=100)

    def __str__(self):
        """Return the name of the product line."""
        return str(self.name)


class Events(models.Model):
    """Model definition for operational events."""

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    discovery_date = models.DateTimeField()
    accounting_date = models.DateField(null=True)
    currency = models.CharField(max_length=100)
    quantity = models.IntegerField()
    recovered_quantity = models.IntegerField()
    recovered_quantity_by_insurance = models.IntegerField()
    event_class = models.ForeignKey(EventClass, on_delete=models.DO_NOTHING)
    event_title = models.CharField(max_length=250)
    process = models.ForeignKey(Process, on_delete=models.DO_NOTHING)
    lost_type = models.ForeignKey(LostType, on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=750)
    product = models.ForeignKey(ProductLine, on_delete=models.DO_NOTHING)
    status = models.BooleanField()
    close_date = models.DateField()
    reported_by = models.CharField(max_length=100)
    # Also called classification
    critical = models.BooleanField()
    level = models.ForeignKey(Level, on_delete=models.DO_NOTHING, null=True)
    public_accounts_affected = models.CharField(max_length=250)
    plan = models.CharField(max_length=250)
    learning = models.CharField(max_length=500)

    def __str__(self):
        """Return the event title."""
        return str(self.event_title)
