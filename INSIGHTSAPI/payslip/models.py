"""Model for the payslip."""

from django.db import models


# Create your models here.
class Payslip(models.Model):
    """Model for the payslip."""

    title = models.CharField(max_length=100)
    identification = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    days = models.IntegerField()
    biweekly_period = models.DecimalField(max_digits=12, decimal_places=2)
    transport_allowance = models.DecimalField(max_digits=12, decimal_places=2)
    bonus_paycheck = models.DecimalField(max_digits=12, decimal_places=2)
    gross_earnings = models.DecimalField(max_digits=12, decimal_places=2)
    healthcare_contribution = models.DecimalField(max_digits=12, decimal_places=2)
    pension_contribution = models.DecimalField(max_digits=12, decimal_places=2)
    tax_withholding = models.DecimalField(max_digits=12, decimal_places=2)
    additional_deductions = models.DecimalField(max_digits=12, decimal_places=2)
    apsalpen = models.DecimalField(max_digits=12, decimal_places=2)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2)
    net_pay = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title + " - " + self.identification
