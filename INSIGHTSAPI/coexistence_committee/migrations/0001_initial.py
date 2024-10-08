# Generated by Django 5.0.8 on 2024-10-03 16:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hierarchy', '0007_alter_area_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.CharField(max_length=200)),
                ('attendant', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='hierarchy.jobposition')),
            ],
        ),
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('reason', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='coexistence_committee.reason')),
            ],
        ),
    ]