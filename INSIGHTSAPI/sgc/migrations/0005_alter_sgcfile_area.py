# Generated by Django 5.0 on 2023-12-26 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sgc', '0004_alter_sgcfile_file_alter_sgcfile_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sgcfile',
            name='area',
            field=models.CharField(max_length=100),
        ),
    ]
