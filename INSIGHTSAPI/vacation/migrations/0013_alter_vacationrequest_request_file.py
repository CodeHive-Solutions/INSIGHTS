# Generated by Django 5.0.2 on 2024-07-03 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacation', '0012_alter_vacationrequest_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vacationrequest',
            name='request_file',
            field=models.FileField(upload_to='files/vacation_requests/'),
        ),
    ]