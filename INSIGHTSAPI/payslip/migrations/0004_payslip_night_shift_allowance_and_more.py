# Generated by Django 5.0.2 on 2024-04-11 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0003_payslip_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='payslip',
            name='night_shift_allowance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='night_shift_holiday_allowance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='night_shift_holiday_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='night_shift_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='night_shift_overtime_allowance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='night_shift_overtime_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
    ]