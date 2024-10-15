# Generated by Django 5.0.8 on 2024-10-10 15:26

import django.db.models.deletion
import pqrs.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pqrs', '0001_squashed_0004_alter_complaint_area_alter_congratulation_area_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='congratulation',
            name='area',
        ),
        migrations.RemoveField(
            model_name='congratulation',
            name='user',
        ),
        migrations.RemoveField(
            model_name='other',
            name='area',
        ),
        migrations.RemoveField(
            model_name='other',
            name='user',
        ),
        migrations.RemoveField(
            model_name='suggestion',
            name='area',
        ),
        migrations.RemoveField(
            model_name='suggestion',
            name='user',
        ),
        migrations.CreateModel(
            name='Management',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area', models.CharField(max_length=50)),
                ('attendant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PQRS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.CharField(max_length=50)),
                ('description', models.TextField(validators=[pqrs.models.validate_max_length_2000])),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('management', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pqrs.management')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Complaint',
        ),
        migrations.DeleteModel(
            name='Congratulation',
        ),
        migrations.DeleteModel(
            name='Other',
        ),
        migrations.DeleteModel(
            name='Suggestion',
        ),
    ]