# Generated by Django 5.0.8 on 2024-10-07 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coexistence_committee', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaint',
            name='reason',
            field=models.CharField(max_length=255),
        ),
        migrations.DeleteModel(
            name='Reason',
        ),
    ]
