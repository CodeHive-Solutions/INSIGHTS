# Generated by Django 5.0.7 on 2024-08-05 10:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hierarchy", "0003_jobposition"),
        # migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # ! This migration is not compatible with the current state of Users the manager field is add in the 0008 migration
        # migrations.AddField(
        #     model_name='area',
        #     name='manager',
        #     field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='managed_areas', to=settings.AUTH_USER_MODEL),
        # ),
    ]
