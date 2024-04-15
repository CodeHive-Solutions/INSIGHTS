# Generated by Django 5.0.2 on 2024-04-15 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0004_payslip_night_shift_allowance_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payslip',
            old_name='night_shift_holiday_hours',
            new_name='surcharge_holiday_hours',
        ),
        migrations.RenameField(
            model_name='payslip',
            old_name='night_shift_allowance',
            new_name='surcharge_night_shift_allowance',
        ),
        migrations.RenameField(
            model_name='payslip',
            old_name='night_shift_holiday_allowance',
            new_name='surcharge_night_shift_holiday_allowance',
        ),
        migrations.RenameField(
            model_name='payslip',
            old_name='night_shift_hours',
            new_name='surcharge_night_shift_hours',
        ),
        migrations.RemoveField(
            model_name='payslip',
            name='night_shift_overtime_allowance',
        ),
        migrations.RemoveField(
            model_name='payslip',
            name='night_shift_overtime_hours',
        ),
        migrations.AddField(
            model_name='payslip',
            name='surcharge_holiday_allowance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payslip',
            name='surcharge_night_shift_holiday_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
    ]
