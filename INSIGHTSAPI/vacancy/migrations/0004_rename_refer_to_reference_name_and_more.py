# Generated by Django 5.0 on 2024-01-29 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacancy', '0003_remove_reference_phone'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reference',
            old_name='refer_to',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='reference',
            name='email',
        ),
        migrations.AddField(
            model_name='reference',
            name='phone_number',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
