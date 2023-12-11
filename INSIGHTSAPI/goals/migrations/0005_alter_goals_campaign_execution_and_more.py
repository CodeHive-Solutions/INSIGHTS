# Generated by Django 4.2.7 on 2023-12-06 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0004_rename_observation_goals_observation_execution_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goals',
            name='campaign_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='goals',
            name='coordinator_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='goals',
            name='criteria_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='goals',
            name='job_title_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='goals',
            name='quantity_execution',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='historicalgoals',
            name='campaign_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='historicalgoals',
            name='coordinator_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='historicalgoals',
            name='criteria_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='historicalgoals',
            name='job_title_execution',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='historicalgoals',
            name='quantity_execution',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
