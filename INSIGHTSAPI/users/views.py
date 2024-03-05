"""User views."""

import base64
import pdfkit
from num2words import num2words
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from django.conf import settings
from django.db import connections
from django.utils.formats import number_format
from django.utils import timezone
from users.models import User


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
        user = request.user
    with open(str(settings.STATIC_ROOT) + "/images/just_logo.png", "rb") as logo:
        logo = logo.read()
        logo = base64.b64encode(logo).decode("utf-8")
    with connections["staffnet"].cursor() as cursor:
        cursor.execute(
            "SELECT fecha_ingreso, cargo, salario, tipo_contrato, lugar_expedicion FROM employment_information, personal_information WHERE personal_information.cedula = %s and employment_information.cedula = %s",
            [user.cedula, user.cedula],
        )
        employee = cursor.fetchone()
        if not employee:
            return Response({"error": "No se encontró el empleado"}, status=404)
        employee = {
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
        print(employee)
    # Create the certification
    template = render_to_string(
        "employment_certification.html",
        {"user": user, "user_data": employee, "logo": logo},
    )
    options = {"page-size": "Letter", "dpi": 600}
    try:
        pdf = pdfkit.from_string(template, False, options=options)
    except Exception:
        return Response({"error": "No se pudo crear el archivo PDF"}, status=500)
    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = (
        f'attachment; filename="Certificado laboral {user.get_full_name()}.pdf"'
    )
    return response
    # return render(
    #     request,
    #     "employment_certification.html",
    #     {"user": user, "logo": logo},
    # )


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
