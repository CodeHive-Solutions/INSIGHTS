# Generated by Django 5.0.2 on 2024-05-23 11:52

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vacationrequest',
            name='uploaded_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vacationrequest',
            name='uploaded_by',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
