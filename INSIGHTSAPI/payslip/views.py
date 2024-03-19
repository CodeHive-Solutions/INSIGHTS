"""Views for the payslip."""

import pdfkit
import base64
from faker import Faker
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.decorators import api_view

# from services.emails import send_email
from django.core import mail
from users.models import User
from django.template.loader import render_to_string
from django.db import connections
from django.conf import settings
from .tasks import send_email_with_attachment
from .models import Payslip
from .serializers import PayslipSerializer


def send_payslip(payslips):
    emails = []
    messages = []
    with open(str(settings.STATIC_ROOT) + "/images/Logo_cyc_text.png", "rb") as logo:
        logo = logo.read()
        logo = base64.b64encode(logo).decode("utf-8")
    send_email_with_attachment.delay(payslips, logo, settings.EMAIL_HOST_USER)
    return Response(
        {"message": "Desprendibles de nomina enviados", "emails": emails}, status=201
    )


@api_view(["POST"])
def resend_payslip(request, pk):
    payslip = Payslip.objects.filter(pk=pk).first()
    if not payslip:
        return Response(
            {"error": "No se encontró el desprendible de nomina"}, status=404
        )
    if "email" in request.data:
        payslip.email = request.data["email"]
    return send_payslip([payslip])


class PayslipViewSet(viewsets.ModelViewSet):
    """Views for the payslip."""

    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_queryset(self):
        """Get the queryset."""
        if self.request.user.has_perm("payslip.view_payslip"):
            return Payslip.objects.all()
        return Payslip.objects.filter(identification=self.request.user.cedula)

    def create(self, request):
        """Create a payslip."""
        if not "file" in request.data:
            return Response({"error": "Debes subir un archivo"}, status=400)
        file_obj = request.data["file"]
        try:
            file_content = file_obj.read().decode("utf-8")
        except UnicodeDecodeError:
            return Response(
                {"error": "Asegúrate de guardar el archivo en formato CSV UTF-8."},
                status=400,
            )
        rows = file_content.split("\n")[1:]
        payslips = []

        for line in rows:
            if line.startswith(";;") or line == "":
                continue
            data = line.split(";")
            if len(data) < 18:
                return Response(
                    {
                        "Error": "El archivo no tiene la cantidad de columnas requeridas."
                    },
                    status=400,
                )
            user = User.objects.filter(cedula=data[1]).first()
            if user:
                identification = user.cedula
                email = user.email
                name = user.get_full_name()
            else:
                with connections["staffnet"].cursor() as cursor:
                    cursor.execute(
                        "SELECT * FROM personal_information JOIN employment_information ON personal_information.cedula = employment_information.cedula WHERE personal_information.cedula = %s",
                        [data[1]],
                    )
                    row = cursor.fetchone()
                    if cursor.description and row:
                        columns = [col[0] for col in cursor.description]
                        result_dict = dict(zip(columns, row))
                        # print(result_dict)
                        # print(type(result_dict["apellidos"]))
                        User.objects.create(
                            username=result_dict["usuario_windows"],
                            cedula=result_dict["cedula"],
                            first_name=result_dict["nombres"],
                            last_name=result_dict["apellidos"],
                            email=result_dict["correo"],
                        )
                        user = User.objects.get(cedula=data[1])
                        email = user.email
                        name = user.get_full_name()
                        identification = user.cedula
                    else:
                        return Response(
                            {
                                "Error": "No se encontró el usuario, asegúrate de que esta registrado en StaffNet",
                                "cedula": data[1],
                            },
                        )
            payslip = PayslipSerializer(
                data={
                    "title": data[0],
                    "identification": identification,
                    "name": name,
                    "area": data[3],
                    "job_title": data[4],
                    "salary": data[5],
                    "days": data[6],
                    "biweekly_period": data[7],
                    "transport_allowance": data[8],
                    "bonus_paycheck": data[9],
                    "biannual_bonus": data[10],
                    "severance": data[11],
                    "gross_earnings": data[12],
                    "healthcare_contribution": data[13],
                    "pension_contribution": data[14],
                    "tax_withholding": data[15],
                    "additional_deductions": data[16],
                    "apsalpen": data[17],
                    "total_deductions": data[18],
                    "net_pay": data[19],
                    "email": email,
                }
            )
            if payslip.is_valid(raise_exception=False):
                payslips.append(Payslip(**payslip.validated_data))
            else:
                return Response(
                    {"Error": payslip.errors, "cedula": data[2]}, status=400
                )
        Payslip.objects.bulk_create(payslips)
        # Make a pdf with the payslip and send it to the user
        return send_payslip(payslips)

    def retrieve(self, request, pk=None):
        """Retrieve a payslip."""
        payslip = Payslip.objects.filter(pk=pk).first()
        if not payslip:
            return Response(
                {"error": "No se encontró el desprendible de nomina"}, status=404
            )
        if payslip.identification == request.user.cedula or request.user.has_perm(
            "payslip.view_payslip"
        ):
            try:
                serializer = PayslipSerializer(payslip)
                return Response(serializer.data)
            except Payslip.DoesNotExist:
                return Response(
                    {"error": "No se encontró el desprendible de nomina"}, status=404
                )
        return Response(
            {"error": "No tienes permisos para ver esta información"}, status=403
        )

    # def list(self, request):
    #     """List payslips."""
    #     identification = self.request.query_params.get("identification")
    #     if request.user.has_perm("payslip.view_payslip"):
    #         payslips = Payslip.objects.all()
    #         serializer = PayslipSerializer(payslips, many=True)
    #         return Response(serializer.data)
    #     elif identification == request.user.cedula:
    #         payslips = Payslip.objects.filter(identification=identification)
    #         serializer = PayslipSerializer(payslips, many=True)
    #         return Response(serializer.data)
    #     return Response(
    #         {"error": "No tienes permisos para ver esta información"}, status=403
    #     )
