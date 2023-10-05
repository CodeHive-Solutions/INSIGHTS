"""This view allow to upload an Excel file with the goals of the staff and save them in the db."""
import base64
import logging
import re
import ssl
from smtplib import SMTP
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.db import connections, transaction
from django.db.models import Q, Subquery
from django.utils import timezone
from openpyxl import load_workbook
from rest_framework import status as framework_status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Goals, TableInfo
from .serializers import GoalSerializer

logger = logging.getLogger("requests")


class GoalsViewSet(viewsets.ModelViewSet):
    """This viewset automatically provides:
    `list`, `create`, `retrieve`, `update` and `destroy` actions.
    Additionally we also provide an extra `send_email` action."""

    queryset = Goals.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        """This view should return a list of all the goals"""
        # user_id = self.request.session.get("user_id")
        # username = self.request.session.get("username")
        coordinator = self.request.GET.get("coordinator", None)
        month = self.request.GET.get("month", None)
        if coordinator is not None:
            return self.queryset.filter(coordinator=coordinator)
        elif month is not None:
            latest_history_date = (
                Goals.history.filter(  # type: ignore
                    Q(goal_date=month) | Q(execution_date=month)
                )
                .order_by("-history_date")
                .values("history_date")[:1]
            )

            # Filter records with the latest history_date
            unique_goals = Goals.history.filter(history_date=Subquery(latest_history_date))  # type: ignore

            return unique_goals
        else:
            # With out the .all() method, the queryset will be evaluated lazily
            return self.queryset.all()

    @action(detail=False, methods=["post"])
    def send_email(self, request):
        """This action send an email with the PDF file attached."""
        pdf_64 = request.POST.get("pdf")
        cedula = request.POST.get("cedula")
        delivery_type = request.POST.get("delivery_type")
        if pdf_64 and cedula and delivery_type:
            try:
                with connections["staffnet"].cursor() as db_connection:
                    instance = Goals.objects.filter(cedula=cedula).first()
                    db_connection.execute(
                        "SELECT correo,nombre FROM personal_information WHERE cedula = %s",
                        [cedula],
                    )
                    result = db_connection.fetchone()
                    if result is not None and instance is not None:
                        try:
                            correo = result[0]
                            nombre = str(result[1])
                            decoded_pdf_data = base64.b64decode(pdf_64)
                            email = EmailMessage(
                                f"{delivery_type}",
                                "<html><body>"
                                "<div>"
                                f"<p>Estimado/a {nombre}:</p>"
                                f"<p>Se ha procesado su {delivery_type}.<br>"
                                f"Por favor, no responda ni reenvíe este correo. "
                                f"Contiene información confidencial.<br>"
                                '<div style="color: black;">Cordialmente,<br>'
                                "M.I.S. Management Information System C&C Services</div></p>"
                                "</div>"
                                "</body></html>",
                                f"{delivery_type} <{settings.DEFAULT_FROM_EMAIL}>",
                                [str(correo)],
                            )
                            email.content_subtype = "html"
                            email.attach(
                                f"{delivery_type}.pdf",
                                decoded_pdf_data,
                                "application/pdf",
                            )
                            # Get the underlying EmailMessage object
                            email_msg = email.message()
                            # Create an SMTP connection
                            connection = SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
                            connection.ehlo()
                            # Wrap the socket with the SSL context
                            context = ssl.create_default_context()
                            context.check_hostname = False
                            context.verify_mode = ssl.CERT_NONE
                            connection.starttls(context=context)
                            # Authenticate with the SMTP server
                            connection.login(
                                settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD
                            )
                            # Send the email
                            connection.send_message(email_msg)
                            # Close the connection
                            connection.quit()
                            if delivery_type == "Ejecución de metas":
                                instance.accepted_execution_at = timezone.now()
                                instance.accepted_execution = True
                            else:
                                instance.accepted_at = timezone.now()
                                instance.accepted = True
                            instance.save()
                            return Response(
                                {"email": correo}, status=framework_status.HTTP_200_OK
                            )
                            # pylint: disable=broad-except
                        except Exception as error:
                            logger.setLevel(logging.ERROR)
                            logger.exception("Error: %s", str(error))
                            print("Error: %s", str(error))
                            return Response(
                                status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                    else:
                        return Response(
                            {"Error": "Email not found"},
                            status=framework_status.HTTP_404_NOT_FOUND,
                        )
            # pylint: disable=broad-except
            except Exception as error:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(error))
                print("Error: %s", str(error))
                return Response(status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(
                {
                    "Error": f'{"PDF" if not pdf_64 else "Cedula"} not found in the request.'
                },
                status=framework_status.HTTP_400_BAD_REQUEST,
            )

    def create(self, request, *args, **kwargs):
        # Get the file from the request
        file_obj = request.FILES.get("file")
        if file_obj:
            file_name = str(file_obj.name)
            year_pattern = r"\b\d{4}\b"
            months = [
                "ENERO",
                "FEBRERO",
                "MARZO",
                "ABRIL",
                "MAYO",
                "JUNIO",
                "JULIO",
                "AGOSTO",
                "SEPTIEMBRE",
                "OCTUBRE",
                "NOVIEMBRE",
                "DICIEMBRE",
            ]
            month_pattern = r"(?i)(" + "|".join(months) + ")"
            if not re.search(month_pattern, file_name):
                return Response(
                    {"message": "Mes no encontrado en el nombre del archivo."},
                    status=framework_status.HTTP_400_BAD_REQUEST,
                )
            elif not re.search(year_pattern, file_name):
                return Response(
                    {"message": "Año no encontrado en el nombre del archivo."},
                    status=framework_status.HTTP_400_BAD_REQUEST,
                )
            try:
                date = (
                    file_name.split("-")[1].upper()
                    + "-"
                    + file_name.split("-")[2].split(".")[0]
                )
                # Read the Excel file using openpyxl
                workbook = load_workbook(file_obj, read_only=True, data_only=True)
                sheet = workbook[workbook.sheetnames[0]]
                # Get the column indices based on the header names
                header_row = next(sheet.iter_rows(values_only=True))
                header_names = {
                    "CEDULA",
                    "NOMBRE",
                    "CARGO",
                    "CAMPAÑA",
                    "COORDINADOR A CARGO",
                    "ESTADO",
                    "OBSERVACIONES",
                }
                missing_headers = header_names - set(header_row) # type: ignore
                if missing_headers:
                    return Response(
                        {
                            "message": f"Columnas no encontradas: {', '.join(missing_headers)}"
                        },
                        status=framework_status.HTTP_400_BAD_REQUEST,
                    )
                cedula_index = header_row.index("CEDULA")
                name_index = header_row.index("NOMBRE")
                cargo_index = header_row.index("CARGO")
                campaign_index = header_row.index("CAMPAÑA")
                coordinator_index = header_row.index("COORDINADOR A CARGO")
                status_index = header_row.index("ESTADO")
                observation_index = header_row.index("OBSERVACIONES")
                if file_name.upper().find("CLARO") != -1:
                    with transaction.atomic():
                        header_names = {"TABLA"}
                        header_row = next(sheet.iter_rows(values_only=True))  # type: ignore
                        missing_headers = header_names - set(header_row)  # type: ignore
                        if missing_headers:
                            return Response(
                                {
                                    "message": f"Encabezados no encontrados: {', '.join(missing_headers)}"
                                },
                                status=framework_status.HTTP_400_BAD_REQUEST,
                            )
                        table_index = header_row.index("TABLA")
                        sheet = workbook["Tabla_de_valores"]
                        header_names = {
                            "NOMBRE_TABLA",
                            "FRANJA",
                            "META DIARIA",
                            "DIAS",
                            "META MES CON PAGO",
                            "POR HORA",
                            "RECAUDO POR CUENTA",
                        }
                        header_row = next(sheet.iter_rows(values_only=True))  # type: ignore
                        missing_headers = header_names - set(header_row)  # type: ignore
                        if missing_headers:
                            return Response(
                                {
                                    "message": f"Encabezados no encontrados: {', '.join(missing_headers)}"
                                },
                                status=framework_status.HTTP_400_BAD_REQUEST,
                            )
                        table_name_index = header_row.index("NOMBRE_TABLA")
                        fringe_index = header_row.index("FRANJA")
                        diary_goal_index = header_row.index("META DIARIA")
                        days_index = header_row.index("DIAS")
                        month_goal_index = header_row.index("META MES CON PAGO")
                        hours_index = header_row.index("POR HORA")
                        collection_account_index = header_row.index(
                            "RECAUDO POR CUENTA"
                        )
                        sheet = workbook[workbook.sheetnames[0]]
                        for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):  # type: ignore
                            cargo = str(row[cargo_index].value).upper().lstrip(".")
                            if cargo.find("ASESOR") != -1:
                                # Avoid NoneType error
                                def format_cell_value(cell):
                                    if cell.value is None or "":
                                        return ""
                                    else:
                                        return "{:.2%}".format(cell.value)

                                cedula = row[cedula_index].value
                                name = row[name_index].value
                                coordinator = row[coordinator_index].value
                                campaign = row[campaign_index].value
                                observation = row[observation_index].value
                                table = row[table_index].value
                                status = row[status_index].value
                                if str(status).upper() == "ACTIVO":
                                    status = True
                                elif str(status).upper() == "RETIRADO":
                                    status = False
                                else:
                                    return Response(
                                        {
                                            "message": "Se encontraron asesores sin estado."
                                        },
                                        status=framework_status.HTTP_400_BAD_REQUEST,
                                    )
                                # Update or create the record
                                unique_constraint = "cedula"
                                default_value = {
                                    "name": str(name).upper(),
                                    "job_title": cargo,
                                    "campaign": campaign,
                                    "coordinator": coordinator,
                                    "goal_date": date,
                                    "status": status,
                                    "observation": observation,
                                    "table_goal": table,
                                }
                                try:
                                    instance = Goals.objects.filter(cedula=cedula)
                                    if instance.exists():
                                        instance.update(accepted=None, accepted_at=None)
                                    Goals.objects.update_or_create(
                                        defaults=default_value,
                                        **{unique_constraint: cedula},
                                    )
                                except ValidationError as validation_e:
                                    logger.setLevel(logging.ERROR)
                                    logger.exception("Validation error: %s", str(validation_e))
                                    return Response(
                                        {
                                            "message": "Excel upload Failed.",
                                            "error": str(validation_e),
                                        },
                                        status=framework_status.HTTP_400_BAD_REQUEST,
                                    )
                                except Exception as error:
                                    logger.setLevel(logging.ERROR)
                                    logger.exception("Error: %s", str(error))
                                    return Response(
                                        {
                                            "message": "Excel upload Failed.",
                                            "error": str(error),
                                        },
                                        status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR,
                                    )
                        sheet = workbook["Tabla_de_valores"]
                        table_name = None
                        for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):  # type: ignore
                            if i == 2:
                                TableInfo.objects.all().delete()
                            try:
                                if row[table_name_index].value is not None or "":
                                    table_name = row[table_name_index].value
                                if table_name:
                                    fringe = row[fringe_index].value
                                    diary_goal = row[diary_goal_index].value
                                    days = row[days_index].value
                                    month_goal = row[month_goal_index].value
                                    hours = row[hours_index].value
                                    collection_account_str = str(
                                        row[collection_account_index].value
                                    )
                                    collection_account = re.sub(
                                        r"[^0-9]", "", collection_account_str
                                    )
                                    TableInfo.objects.create(
                                        name=str(table_name).upper(),
                                        fringe=fringe,
                                        diary_goal=diary_goal,
                                        days=days,
                                        month_goal=month_goal,
                                        hours=hours,
                                        collection_account=collection_account,
                                    )
                            except Exception as error:
                                logger.setLevel(logging.ERROR)
                                logger.exception("Error: %s", str(error))
                                return Response(
                                    {
                                        "message": "Excel upload Failed.",
                                        "error": str(error),
                                    },
                                    status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR,
                                )
                        return Response(
                            {
                                "message": "Excel file uploaded and processed successfully."
                            },
                            status=framework_status.HTTP_201_CREATED,
                        )
                header_names = {"DESCRIPCION DE LA VARIABLE A MEDIR", "CANTIDAD"}
                missing_headers = header_names - set(header_row)  # type: ignore
                if missing_headers:
                    return Response(
                        {
                            "message": f"Estos encabezados no fueron encontrados: {', '.join(missing_headers)}"
                        },
                        status=framework_status.HTTP_400_BAD_REQUEST,
                    )
                criteria_index = header_row.index("DESCRIPCION DE LA VARIABLE A MEDIR")
                quantity_index = header_row.index("CANTIDAD")
                if (
                    file_name.upper().find("EJECUCIÓN") != -1
                    or file_name.upper().find("EJECUCION") != -1
                ):
                    header_names = {
                        "% CUMPLIMIENTO",
                        "EVALUACION",
                        "CALIDAD",
                        "CLEAN DESK",
                        "TOTAL",
                    }
                    missing_headers = header_names - set(header_row)  # type: ignore
                    if missing_headers:
                        return Response(
                            {
                                "message": f"Estos encabezados no fueron encontrados: {', '.join(missing_headers)}"
                            },
                            status=framework_status.HTTP_400_BAD_REQUEST,
                        )
                    result_index = header_row.index("% CUMPLIMIENTO")
                    evaluation_index = header_row.index("EVALUACION")
                    quality_index = header_row.index("CALIDAD")
                    clean_desk_index = header_row.index("CLEAN DESK")
                    total_index = header_row.index("TOTAL")
                else:
                    result_index = None
                    evaluation_index = None
                    quality_index = None
                    clean_desk_index = None
                    total_index = None
                for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):  # type: ignore
                    cargo = str(row[cargo_index].value)
                    cedula = row[cedula_index]
                    if cargo.upper().find("ASESOR") != -1:
                        # Avoid NoneType error
                        def format_cell_value(cell):
                            if cell.value is None or "":
                                return ""
                            else:
                                return "{:.2%}".format(cell.value)

                        cedula = row[cedula_index].value
                        name = row[name_index].value
                        coordinator = row[coordinator_index].value
                        campaign = row[campaign_index].value
                        criteria = row[criteria_index].value
                        observation = row[observation_index].value
                        status = row[status_index].value
                        entrega = True
                        if (
                            file_name.upper().find("EJECUCION") != -1
                            or file_name.upper().find("EJECUCIÓN") != -1
                        ):
                            result_cell = row[result_index]  # type: ignore
                            result = format_cell_value(result_cell)
                            evaluation_cell = row[evaluation_index]  # type: ignore
                            evaluation = format_cell_value(evaluation_cell)
                            quality = format_cell_value(row[quality_index])  # type: ignore
                            clean_desk = format_cell_value(row[clean_desk_index])  # type: ignore
                            total = format_cell_value(row[total_index])  # type: ignore
                            entrega = False
                        else:
                            result = None
                            evaluation = None
                            quality = None
                            clean_desk = None
                            total = None
                        if str(status).upper() == "ACTIVO":
                            status = True
                        elif str(status).upper() == "RETIRADO":
                            status = False
                        else:
                            return Response(
                                {"message": "Se encontraron asesores sin estado."},
                                status=framework_status.HTTP_400_BAD_REQUEST,
                            )
                        # Update or create the record
                        unique_constraint = "cedula"
                        default_value = {
                            "name": name,
                            "job_title": cargo,
                            "campaign": campaign,
                            "coordinator": coordinator,
                            "criteria": criteria,
                            "result": result,
                            "quality": quality,
                            "evaluation": evaluation,
                            "clean_desk": clean_desk,
                            "total": total,
                            "status": status,
                        }
                        if entrega:
                            default_value["quantity"] = row[quantity_index].value
                        # Remove empty values from default_value dictionary
                        default_value = {k: v for k, v in default_value.items() if v}
                        instance = Goals.objects.filter(cedula=cedula)
                        if file_name.upper().find("ENTREGA") != -1:
                            default_value["goal_date"] = date
                            if instance.exists():
                                instance.update(accepted=None, accepted_at=None)
                        elif (
                            file_name.upper().find("EJECUCION") != -1
                            or file_name.upper().find("EJECUCIÓN") != -1
                        ):
                            default_value["execution_date"] = date
                            if instance.exists():
                                instance.update(
                                    accepted_execution=None, accepted_execution_at=None
                                )
                        Goals.objects.update_or_create(
                            defaults=default_value, **{unique_constraint: cedula}
                        )
                return Response(
                    {"message": "Excel file uploaded and processed successfully."},
                    status=framework_status.HTTP_201_CREATED,
                )
            except ValidationError as validation_e:
                logger.setLevel(logging.ERROR)
                logger.exception("Validation error: %s", str(validation_e))
                return Response(
                    {"message": "Excel upload Failed.", "Error": str(validation_e)},
                    status=framework_status.HTTP_400_BAD_REQUEST,
                )
            except Exception as error:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(error))
                return Response(
                    {"message": "Excel upload Failed.", "Error": str(error)},
                    status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"message": "Excel no encontrado."},
                status=framework_status.HTTP_400_BAD_REQUEST,
            )
