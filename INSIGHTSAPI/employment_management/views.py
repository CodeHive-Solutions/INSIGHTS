"""User views."""

import os
import base64
import pdfkit
import logging
import mysql.connector
from num2words import num2words
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.template.loader import render_to_string
from django.conf import settings
from django.db import connections
from django.utils.formats import number_format
from django.utils import timezone
from payslip.models import Payslip
from services.emails import send_email
from users.models import User
from .models import EmploymentCertification


logger = logging.getLogger("requests")


def read_and_encode_image(file_path):
    """Read an image and encode it to base64."""
    if os.path.exists(file_path):
        with open(file_path, "rb") as file:
            image_data = file.read()
            encoded_image = base64.b64encode(image_data).decode("utf-8")
        return encoded_image
    else:
        return None


def capitalize_phrase(text):
    """Capitalize a phrase ignoring conjunctions and prepositions in uppercase and lowercase."""
    ignore_words = [
        "de",
        "del",
        "la",
        "las",
        "los",
        "y",
        "a",
        "en",
        "con",
        "por",
        "para",
        "al",
        "el",
        "un",
        "una",
        "unos",
        "unas",
    ]
    words = text.split()
    for i, word in enumerate(words):
        if word.lower() not in ignore_words:
            words[i] = word.capitalize()
        else:
            words[i] = word.lower()
    return " ".join(words)


def create_employment_certification(request):
    """Create an employment certification."""
    identification = request.data.get("identification") or request.user.cedula
    months = request.data.get("months")
    if months:
        months = int(months)
        # Get the last X bonus in the payslips
        payslips = Payslip.objects.filter(
            identification=identification, biannual_bonus__gt=0
        ).order_by("-created_at")[:months]
        if months > payslips.count():
            return Response(
                {"error": f"El usuario no tiene {months} desprendibles de nómina."},
                status=404,
            )
        # Get the average of the last X bonus
        bonus_amount = sum([p.biannual_bonus for p in payslips]) / len(payslips)
    if identification:
        user = User.objects.filter(cedula=identification).first()
        if not user:
            # Create the certification
            return Response(
                {"error": "No se encontró el usuario en la intranet"}, status=404
            )
    else:
        user = User.objects.get(pk=request.user.pk)
    logo = read_and_encode_image(
        os.path.join(settings.STATIC_ROOT, "images", "just_logo.png")
    )
    logo_bpo = read_and_encode_image(
        os.path.join(settings.STATIC_ROOT, "images", "ACDCC_logo.png")
    )
    logo_vertical = read_and_encode_image(
        os.path.join(settings.STATIC_ROOT, "images", "vertical_logo.png")
    )
    payroll_signature = read_and_encode_image(
        os.path.join(settings.BASE_DIR, "secure", "images", "payroll_signature.png")
    )
    if not logo or not logo_bpo or not payroll_signature or not logo_vertical:
        return Response(
            {
                "error": "No se encontró una o más imágenes necesarias, por favor avisa a tecnología."
            },
            status=500,
        )
    with connections["staffnet"].cursor() as cursor:
        cursor.execute(
            "SELECT fecha_ingreso, cargo, salario, tipo_contrato, lugar_expedicion FROM employment_information, personal_information WHERE personal_information.cedula = %s and employment_information.cedula = %s",
            [user.cedula, user.cedula],
        )
        employee = cursor.fetchone()
        if not employee:
            return Response(
                {
                    "error": "No se encontró el empleado en StaffNet",
                    "cedula": user.cedula,
                },
                status=404,
            )
        employee_info = {
            "start_date": employee[0].strftime("%d de %B de %Y"),
            "position": capitalize_phrase(employee[1]),
            "salary_text": num2words(
                employee[2], lang="es_CO", to="currency"
            ).capitalize(),
            "salary_number": number_format(employee[2]),
            "contract_type": capitalize_phrase(employee[3]),
            "expedition_city": capitalize_phrase(employee[4]),
            "today": timezone.now().strftime("%d de %B de %Y"),
        }
    certification = EmploymentCertification.objects.create(
        user=user,
        start_date=employee[0],
        position=employee_info["position"],
        salary=employee[2],
        contract_type=employee_info["contract_type"],
        expedition_city=employee_info["expedition_city"],
    )
    template_data = {
        "id": certification.id,
        "user": user,
        "user_data": employee_info,
        "logo_cyc": logo,
        "logo_bpo": logo_bpo,
        "logo_vertical": logo_vertical,
        "payroll_signature": payroll_signature,
    }
    if months:
        template_data["bonus"] = months
        template_data["bonus_amount"] = bonus_amount
        template_data["bonus_text"] = num2words(
            bonus_amount, lang="es_CO", to="currency"
        ).capitalize()
    template = render_to_string("employment_certification.html", template_data)
    options = {"page-size": "Letter", "dpi": 600}
    try:
        pdf = pdfkit.from_string(template, False, options=options)
    except Exception as e:
        logger.critical(f"Error creating PDF: {e}")
        return Response({"error": "No se pudo crear el archivo PDF"}, status=500)

    # Send the certification
    errors = send_email(
        "Certificación laboral",
        "Adjunto se encuentra la certificación laboral solicitada.",
        [str(user.email)],
        attachments=[("Certificación laboral.pdf", pdf, "application/pdf")],
    )
    if errors:
        return Response({"error": "Error enviando el correo"}, status=500)
    return Response(
        {"message": "Certificación laboral enviada", "email": user.email}, status=200
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_employment_certification(request):
    """Send an employment certification."""
    if "identification" in request.data and not request.user.has_perm(
        "employment_management.get_employment_certification"
    ):
        return Response(
            {"error": "No tienes permisos para realizar esta acción"}, status=403
        )
    return create_employment_certification(request)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def upload_old_certifications(request):
    """Upload old certifications."""
    db_config = {
        "user": "root",
        "password": os.environ["LEYES"],
        "host": "172.16.0.6",
        "port": "3306",
        "database": "userscyc",
    }
    mysql_connection = mysql.connector.connect(**db_config)
    cursor = mysql_connection.cursor()
    cursor.execute(
        "SELECT * FROM userscyc.despre_nom_his where fecha_envio > '2023-09' and fecha_envio < '2024-02-27'"
    )
    i = 0
    for row in cursor.fetchall():
        i += 1
        Payslip.objects.create(
            title=row[1],
            identification=row[2],
            name=row[3],
            area=row[4],
            job_title=row[5],
            salary=row[6],
            days=row[7],
            biweekly_period=row[8],
            transport_allowance=row[9],
            bonus_paycheck=row[10],
            gross_earnings=row[11],
            healthcare_contribution=row[12],
            pension_contribution=row[13],
            tax_withholding=row[14],
            additional_deductions=row[15],
            apsalpen=row[16],
            total_deductions=row[17],
            net_pay=row[18],
            email=row[20],
            created_at=row[21],
            biannual_bonus=0,
            severance=0,
        )
    return Response({"message": f"{i} registros creados"}, status=200)
