# Generated by Django 5.0 on 2024-01-26 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vacancy', '0002_rename_name_vacancy_vacancy_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reference',
            name='phone',
        ),
    ]
