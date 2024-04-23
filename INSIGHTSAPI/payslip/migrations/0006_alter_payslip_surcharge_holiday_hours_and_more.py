# Generated by Django 5.0.2 on 2024-04-15 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0005_rename_night_shift_holiday_hours_payslip_surcharge_holiday_hours_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payslip',
            name='surcharge_holiday_hours',
            field=models.DecimalField(decimal_places=1, max_digits=12),
        ),
        migrations.AlterField(
            model_name='payslip',
            name='surcharge_night_shift_holiday_hours',
            field=models.DecimalField(decimal_places=1, max_digits=12),
        ),
        migrations.AlterField(
            model_name='payslip',
            name='surcharge_night_shift_hours',
            field=models.DecimalField(decimal_places=1, max_digits=12),
        ),
    ]