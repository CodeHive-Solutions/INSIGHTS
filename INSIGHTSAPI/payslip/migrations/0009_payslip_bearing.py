# Generated by Django 5.0.8 on 2024-10-08 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payslip', '0008_alter_payslip_solidarity_fund_percentage'),
    ]

    operations = [
        migrations.AddField(
            model_name='payslip',
            name='bearing',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
            preserve_default=False,
        ),
    ]
