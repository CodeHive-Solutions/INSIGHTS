# Generated by Django 5.0.2 on 2024-03-01 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0002_payslip_biannual_bonus_payslip_severance'),
    ]

    operations = [
        migrations.AddField(
            model_name='payslip',
            name='email',
            field=models.EmailField(default='a@dasda.com', max_length=254),
            preserve_default=False,
        ),
    ]
