# Generated by Django 5.0.2 on 2024-06-11 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacation', '0009_rename_observation_vacationrequest_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vacationrequest',
            name='hr_approved',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
