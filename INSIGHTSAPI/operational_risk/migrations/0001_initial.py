# Generated by Django 5.0 on 2024-02-01 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('discovery_date', models.DateField()),
                ('accounting_date', models.DateField()),
                ('currency', models.CharField(max_length=100)),
                ('quantity', models.IntegerField()),
                ('recovered_quantity', models.IntegerField()),
                ('recovered_quantity_by_insurance', models.IntegerField()),
                ('event_class', models.CharField(max_length=100)),
                ('reported_by', models.CharField(max_length=100)),
                ('classification', models.CharField(max_length=100)),
                ('level', models.CharField(max_length=100)),
                ('plan', models.CharField(max_length=100)),
                ('event', models.CharField(max_length=100)),
                ('public_accounts_affected', models.CharField(max_length=100)),
                ('process', models.CharField(max_length=100)),
                ('lost_type', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=100)),
                ('product_line', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=100)),
                ('date_of_closure', models.DateField()),
                ('learning', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'events',
            },
        ),
    ]