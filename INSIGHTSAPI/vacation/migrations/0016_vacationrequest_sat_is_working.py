# Generated by Django 5.0.7 on 2024-08-30 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacation', '0015_rename_uploaded_at_vacationrequest_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='vacationrequest',
            name='sat_is_working',
            field=models.BooleanField(default=True),
        ),
    ]