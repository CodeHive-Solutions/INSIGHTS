# Generated by Django 4.2.5 on 2023-11-09 08:58

from django.db import migrations, models
import django.db.models.deletion
import sgc.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hierarchy', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SGCFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=100)),
                ('sub_type', models.CharField(max_length=100)),
                ('file', models.FileField(upload_to='files/', validators=[sgc.models.validate_file_extension])),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='hierarchy.area')),
            ],
        ),
    ]
