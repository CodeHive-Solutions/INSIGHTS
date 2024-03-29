# Generated by Django 5.0 on 2024-02-02 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operational_risk', '0008_remove_events_event_events_event_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='description',
            field=models.CharField(max_length=750),
        ),
        migrations.AlterField(
            model_name='events',
            name='learning',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='events',
            name='plan',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='events',
            name='public_accounts_affected',
            field=models.CharField(max_length=250),
        ),
    ]
