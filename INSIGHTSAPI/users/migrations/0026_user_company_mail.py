# Generated by Django 5.0.7 on 2024-08-15 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_alter_user_job_position'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='company_mail',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
