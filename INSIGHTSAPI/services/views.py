"""Views for the services app."""

import logging
import os
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django_sendfile import sendfile
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Payslip
from .serializers import PayslipSerializer
from .emails import send_email


logger = logging.getLogger("requests")


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


# class PayslipViewset(viewsets.GenericViewSet):
#     def create(self, request):
#         """Create a payslip."""
#         pass


class PayslipView(APIView):
    """Views for the payslip."""

    def post(self, request, *args, **kwargs):
        """Create a payslip."""
        if not "file" in request.data:
            return Response({"error": "Debes subir un archivo"}, status=400)
        file_obj = request.data["file"]
        file_content = file_obj.read().decode("utf-8")
        rows = file_content.split("\n")
        payslips = []

        for line in rows:
            if line.startswith(";;") or line == "":
                continue
            data = line.split(";")
            if len(data) < 18:
                return Response(
                    {"Error": "Insufficient columns in the line"}, status=400
                )
            payslip = PayslipSerializer(
                data={
                    "title": data[0],
                    "identification": data[1],
                    "name": data[2],
                    "area": data[3],
                    "job_title": data[4],
                    "salary": data[5],
                    "days": data[6],
                    "biweekly_period": data[7],
                    "transport_allowance": data[8],
                    "bonus_paycheck": data[9],
                    "gross_earnings": data[10],
                    "healthcare_contribution": data[11],
                    "pension_contribution": data[12],
                    "tax_withholding": data[13],
                    "additional_deductions": data[14],
                    "apsalpen": data[15],
                    "total_deductions": data[16],
                    "net_pay": data[17],
                }
            )
            # print(data[1])
            if payslip.is_valid(raise_exception=False):
                payslips.append(Payslip(**payslip.validated_data))
            else:
                return Response(
                    {"Error": payslip.errors, "cedula": data[2]}, status=400
                )
        Payslip.objects.bulk_create(payslips)
        return Response({"message": "Payslips created"}, status=201)


@api_view(["POST"])
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
        to_emails = ["heibert.mogollon@cyc-bpo.com", "juan.carreno@cyc-bpo.com"]
    else:
        to_emails = [
            "cesar.garzon@cyc-bpo.com",
            "mario.giron@cyc-bpo.com",
            "jeanneth.pinzon@cyc-bpo.com",
        ]
    errors = send_email(
        sender_user="mismetas",
        subject=f"Denuncia de {request.data['complaint']}",
        message=f"\n{request.data['description']}\n" + contact_info,
        to_emails=to_emails,
        html_content=True,
        email_owner="Línea ética",
        return_path="heibert.mogollon@cyc-bpo.com",
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=500)
    return Response({"message": "Correo enviado correctamente"}, status=200)
