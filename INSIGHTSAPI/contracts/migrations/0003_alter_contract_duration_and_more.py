# Generated by Django 5.0 on 2024-01-04 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contracts', '0002_rename_end_date_contract_renovation_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contract',
            name='duration',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='historicalcontract',
            name='duration',
            field=models.DateField(),
        ),
    ]
