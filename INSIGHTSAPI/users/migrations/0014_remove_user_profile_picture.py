# Generated by Django 5.0 on 2024-01-15 11:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_user_is_staff'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='profile_picture',
        ),
    ]