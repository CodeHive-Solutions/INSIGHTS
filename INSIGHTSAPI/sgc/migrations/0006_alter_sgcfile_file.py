# Generated by Django 5.0 on 2023-12-29 14:14

import sgc.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sgc', '0005_alter_sgcfile_area'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sgcfile',
            name='file',
            field=models.FileField(upload_to='files/SGC/', validators=[sgc.models.file_content_validator]),
        ),
    ]