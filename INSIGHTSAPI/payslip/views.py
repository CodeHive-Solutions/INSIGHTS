"""Views for the payslip."""

import base64
import logging

from django.conf import settings
from django.db import connections
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework.response import Response

from users.models import User

from .models import Payslip
from .serializers import PayslipSerializer
from .tasks import send_email_with_attachment

logger = logging.getLogger("requests")


def convert_numeric_value(value):
    try:
        return float(value.replace(",", "."))
    except ValueError:
        return value


def send_payslip(payslips):
    payslip_data = []
    with open(str(settings.STATIC_ROOT) + "/images/Logo_cyc_text.png", "rb") as logo:
        logo = logo.read()
        logo = base64.b64encode(logo).decode("utf-8")

    for payslip in payslips:
        # iterate over the rows and multiply the values by 100 for the solidary_fund_percentage field
        payslip.solidarity_fund_percentage = "{:.1f}%".format(
            payslip.solidarity_fund_percentage * 100
        )
        payslip_data.append(payslip.to_json())
    queued_task = send_email_with_attachment.delay(
        payslip_data, logo, settings.EMAIL_HOST_USER
    )
    if not queued_task.state == "PENDING":
        return Response(
            {"error": "Ocurrió un error al enviar los desprendibles de nomina"},
            status=500,
        )
    return Response({"message": "Desprendibles de nomina enviados"}, status=201)


@api_view(["POST"])
def resend_payslip(request, pk):
    payslip = Payslip.objects.filter(pk=pk).first()
    if not payslip:
        return Response(
            {"error": "No se encontró el desprendible de nomina"}, status=404
        )
    if "email" in request.data:
        payslip.email = request.data["email"]
    response = send_payslip([payslip])
    if response.status_code == 201:
        return Response({"message": "Desprendible de nomina enviado"}, status=200)
    return response


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
            if len(data) != 29:
                return Response(
                    {
                        "Error": f"El archivo debe tener 29 columnas, el subido tiene {len(data)}",
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
                                "Error": f"No se encontró el usuario {data[1]}, asegúrate de que esta registrado en StaffNet",
                            },
                            status=400,
                        )
            payslip = PayslipSerializer(
                data={
                    # Basic information
                    "title": data[0],
                    "identification": identification,
                    "name": name,
                    "area": data[3],
                    "job_title": data[4],
                    "salary": convert_numeric_value(data[5]),
                    "days": data[6],
                    "biweekly_period": convert_numeric_value(data[7]),
                    # Earnings
                    "transport_allowance": convert_numeric_value(data[8]),
                    "bearing": convert_numeric_value(data[9]),
                    "surcharge_night_shift_hours": convert_numeric_value(data[10]),
                    "surcharge_night_shift_allowance": convert_numeric_value(data[11]),
                    "surcharge_night_shift_holiday_hours": convert_numeric_value(
                        data[12]
                    ),
                    "surcharge_night_shift_holiday_allowance": convert_numeric_value(
                        data[13]
                    ),
                    "surcharge_holiday_hours": convert_numeric_value(data[14]),
                    "surcharge_holiday_allowance": convert_numeric_value(data[15]),
                    "bonus_paycheck": convert_numeric_value(data[16]),
                    "biannual_bonus": convert_numeric_value(data[17]),
                    "severance": convert_numeric_value(data[18]),
                    "gross_earnings": convert_numeric_value(data[19]),
                    # Deductions
                    "healthcare_contribution": convert_numeric_value(data[20]),
                    "pension_contribution": convert_numeric_value(data[21]),
                    "tax_withholding": convert_numeric_value(data[22]),
                    "additional_deductions": convert_numeric_value(data[23]),
                    "apsalpen": convert_numeric_value(data[24]),
                    "solidarity_fund_percentage": convert_numeric_value(data[25]),
                    "solidarity_fund": convert_numeric_value(data[26]),
                    "total_deductions": convert_numeric_value(data[27]),
                    # Final pay and contact
                    "net_pay": convert_numeric_value(data[28]),
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
