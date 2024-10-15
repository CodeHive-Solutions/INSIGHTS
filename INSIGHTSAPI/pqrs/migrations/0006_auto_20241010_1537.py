# Generated by Django 5.0.8 on 2024-10-10 15:37

import sys

from django.core.mail import mail_admins
from django.db import migrations


def create_default_managements(apps, schema_editor):
    # Get models through the `apps` registry to ensure consistency
    Management = apps.get_model("pqrs", "Management")
    Area = apps.get_model("hierarchy", "Area")
    User = apps.get_model("users", "User")
    general_manager = User.objects.filter(job_position__name="GERENTE GENERAL").first()
    risk_manager = User.objects.filter(
        job_position__name="GERENTE DE RIESGO Y CONTROL INTERNO"
    ).first()
    hr_manager = User.objects.filter(
        job_position__name="GERENTE DE GESTION HUMANA"
    ).first()
    planning_manager = User.objects.filter(
        job_position__name="GERENTE DE PLANEACION"
    ).first()
    administration_manager = User.objects.filter(
        job_position__name="GERENTE ADMINISTRATIVA"
    ).first()
    legal_manager = User.objects.filter(job_position__name="GERENTE DE LEGAL").first()
    physical_manager = User.objects.filter(
        job_position__name="GERENTE DE INFRAESTRUCTURA"
    ).first()


class Migration(migrations.Migration):

    dependencies = [
        ("pqrs", "0005_remove_congratulation_area_and_more"),
    ]

    operations = []

    operations = [
        migrations.RunPython(create_default_managements),
    ]
