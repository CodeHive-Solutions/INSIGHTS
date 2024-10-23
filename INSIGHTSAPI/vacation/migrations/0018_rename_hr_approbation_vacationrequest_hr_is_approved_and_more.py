# Generated by Django 5.0.8 on 2024-10-21 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacation', '0017_alter_vacationrequest_status'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vacationrequest',
            old_name='hr_approbation',
            new_name='hr_is_approved',
        ),
        migrations.RenameField(
            model_name='vacationrequest',
            old_name='manager_approbation',
            new_name='manager_is_approved',
        ),
        migrations.RenameField(
            model_name='vacationrequest',
            old_name='payroll_approbation',
            new_name='payroll_is_approved',
        ),
        migrations.AddField(
            model_name='vacationrequest',
            name='boss_approved_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='vacationrequest',
            name='boss_is_approved',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]