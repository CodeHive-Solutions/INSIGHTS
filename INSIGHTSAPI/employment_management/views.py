"""User views."""

import os
import base64
import pdfkit
import logging
from num2words import num2words
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.template.loader import render_to_string
from django.conf import settings
from django.db import connections
from django.utils.formats import number_format
from django.utils import timezone
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


def create_employment_certification(request):
    """Create an employment certification."""
    identification = request.data.get("identification")
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
            "position": employee[1],
            "salary_text": num2words(
                employee[2], lang="es_CO", to="currency"
            ).capitalize(),
            "salary_number": number_format(employee[2]),
            "contract_type": employee[3],
            "expedition_city": employee[4],
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
    template = render_to_string(
        "employment_certification.html",
        {
            "id": certification.id,
            "user": user,
            "user_data": employee_info,
            "logo_cyc": logo,
            "logo_bpo": logo_bpo,
            "logo_vertical": logo_vertical,
            "payroll_signature": payroll_signature,
        },
    )
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
    if "identification" in request.data:
        if not request.user.has_perm("users.send_employment_certification"):
            return Response(
                {"error": "No tienes permisos para realizar esta acción"}, status=403
            )
    return create_employment_certification(request)
