"""Views for the services app."""

import logging
import os
import holidays
from rest_framework.response import Response
from django.views.decorators.cache import cache_page, cache_control
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django_sendfile import sendfile
from services.models import Answer
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import send_mail


logger = logging.getLogger("requests")

CACHE_DURATION = 60 * 60 * 24 * 30  # 30 days


class FileDownloadMixin(APIView):
    """Mixin for download files."""

    # The model have to be put in the views
    model = None

    def get(self, request, pk):
        """Get the file."""
        file_instance = get_object_or_404(self.model, pk=pk)

        file_path = file_instance.file.path
        file_name = file_name = os.path.basename(file_path)

        response = sendfile(
            request,
            file_path,
            attachment=True,
            attachment_filename=file_name,
        )
        return response


@api_view(["POST"])
@permission_classes([AllowAny])
def send_report_ethical_line(request):
    """Send a report from the ethical line."""
    if not "complaint" in request.data:
        return Response({"error": "El tipo de denuncia es requerido"}, status=400)
    if not "description" in request.data:
        return Response(
            {"error": "La descripción de la denuncia es requerida"}, status=400
        )

    contact_info = ""
    if "contact_info" in request.data:
        contact_info = f"\nEl usuario desea ser contactado mediante:\n{request.data['contact_info']}"
    if settings.DEBUG or "test" in request.data["complaint"].lower():
        to_emails = [settings.EMAIL_FOR_TEST]
    else:
        to_emails = settings.EMAILS_ETHICAL_LINE
    send_mail(
        f"Denuncia de {request.data['complaint']}",
        f"\n{request.data['description']}\n" + contact_info,
        None,
        to_emails,
        fail_silently=False,
        html_message="True",
    )

    return Response({"message": "Correo enviado correctamente"}, status=200)


def trigger_error(request):
    """Trigger an error for testing purposes."""
    raise Exception("Test error")


@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 60 * 24, key_prefix="holidays")
@cache_control(private=True, max_age=60 * 60 * 24)
def get_holidays(request, year):
    """Get the holidays of the year."""
    try:
        year = int(year)
    except ValueError:
        return Response({"error": "El año debe ser un número"}, status=400)
    # Get the holidays of the year and the next year
    holidays_year = holidays.CO(years=range(year, year + 2)).items()
    return Response(holidays_year, status=200)


@api_view(["POST"])
def save_answer(request):
    """Save an answer."""

    if not "duration" in request.data:
        return Response({"error": "La duración es requerida"}, status=400)
    if not "question_1" in request.data:
        return Response({"error": "La pregunta 1 es requerida"}, status=400)
    if not "question_2" in request.data:
        return Response({"error": "La pregunta 2 es requerida"}, status=400)
    if not "question_3" in request.data:
        return Response({"error": "La pregunta 3 es requerida"}, status=400)

    try:
        duration = timedelta(microseconds=int(request.data["duration"]))
    except ValueError:
        return Response({"error": "La duración debe ser un número"}, status=400)

    answer = Answer(
        user=request.user,
        question_1=request.data["question_1"],
        question_2=request.data["question_2"],
        question_3=request.data["question_3"],
        duration=duration,
    )
    answer.save()

    return Response({"message": "Respuesta guardada correctamente"}, status=201)


@api_view(["GET"])
def check_answered(request):
    """Check if the user has answered the questions."""
    if Answer.objects.filter(user=request.user).exists():
        return Response({"answered": True}, status=200)
    return Response({"answered": False}, status=200)
