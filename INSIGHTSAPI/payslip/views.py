"""Views for the payslip."""

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from .models import Payslip
from .serializers import PayslipSerializer


class PayslipViewSet(viewsets.ModelViewSet):
    """Views for the payslip."""

    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def create(self, request):
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
                    {
                        "Error": "El archivo no tiene la cantidad de columnas requeridas."
                    },
                    status=400,
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
            if payslip.is_valid(raise_exception=False):
                payslips.append(Payslip(**payslip.validated_data))
            else:
                return Response(
                    {"Error": payslip.errors, "cedula": data[2]}, status=400
                )
        Payslip.objects.bulk_create(payslips)
        return Response({"message": "Payslips created"}, status=201)

    def retrieve(self, request, pk=None):
        """Retrieve a payslip."""
        if pk == request.user.cedula:
            payslip = Payslip.objects.get(identification=pk)
            serializer = PayslipSerializer(payslip)
            return Response(serializer.data)
        return Response(
            {"error": "No tienes permisos para ver esta información"}, status=403
        )

    def list(self, request):
        """List payslips."""
        if request.user.has_perm("payslip.view_payslip"):
            payslips = Payslip.objects.all()
            serializer = PayslipSerializer(payslips, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "No tienes permisos para ver esta información"}, status=403
        )
