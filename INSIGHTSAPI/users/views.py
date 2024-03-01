"""User views."""

import base64
import pdfkit
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.template.loader import render_to_string
from django.shortcuts import render
from django.conf import settings
from users.models import User


def create_employment_certification(request):
    """Create an employment certification."""
    identification = request.data.get("identification")
    if identification:
        user = User.objects.filter(identification=identification).first()
        if not user:
            # Create the certification
            return Response({"error": "No se encontró el usuario"}, status=404)
    else:
        user = request.user
    with open(str(settings.STATIC_ROOT) + "/images/just_logo.png", "rb") as logo:
        logo = logo.read()
        logo = base64.b64encode(logo).decode("utf-8")
    # Create the certification
    template = render_to_string(
        "employment_certification.html",
        {"user": user, "logo": logo},
    )
    pdf = pdfkit.from_string(template, False)
    return Response(pdf, content_type="application/pdf", status=200)
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
