# Generated by Django 5.0 on 2024-02-02 08:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operational_risk', '0002_alter_events_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Process',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='events',
            name='classification',
        ),
        migrations.AddField(
            model_name='events',
            name='critical',
            field=models.BooleanField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='events',
            name='event_class',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='operational_risk.eventclass'),
        ),
        migrations.AlterField(
            model_name='events',
            name='level',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='operational_risk.level'),
        ),
        migrations.AlterField(
            model_name='events',
            name='process',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='operational_risk.process'),
        ),
    ]