# Generated by Django 5.0 on 2024-02-02 11:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operational_risk', '0004_losttype_alter_events_event_class_alter_events_level_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='level',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='operational_risk.level'),
        ),
    ]
