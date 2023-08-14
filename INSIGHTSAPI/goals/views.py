import logging
import os
import re
from django.utils import timezone
import ssl
import ftfy
from smtplib import SMTP
import base64
import mysql.connector
from django.conf import settings
from django.core.mail import EmailMessage
from openpyxl import load_workbook
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status as framework_status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Goals, MultipleGoals
from .serializers import GoalSerializer

logger = logging.getLogger("requests")

class GoalsViewSet(viewsets.ModelViewSet):
    queryset = Goals.objects.all()
    serializer_class = GoalSerializer

    #Esta funcion permite buscar por el nombre del coordinador
    def get_queryset(self):
        queryset = Goals.objects.all()
        coordinator = self.request.GET.get('coordinator', None)
        if coordinator is not None:
            # filter the queryset based on possible name formats
            queryset = queryset.filter(coordinator=coordinator)
        return queryset

    @action(detail=False, methods=['post'])
    def send_email(self, request, *args, **kwargs):
        pdf_64 = request.POST.get('pdf')
        cedula = request.POST.get('cedula')
        delivery_type = request.POST.get('delivery_type')
        db_connection = None
        if pdf_64 and cedula and delivery_type:
            try:
                intranet_config = {
                    'host': '172.16.0.6',
                    'user': 'root',
                    'password': os.getenv('LEYES'),
                    'database': 'userscyc',
                    'port': '3306',
                }
                intranet_db = mysql.connector.connect(**intranet_config)
                db_cursor = intranet_db.cursor()
                instance = Goals.objects.filter(cedula=cedula).first()
                db_cursor.execute("SELECT email_user, pnom_user, pape_user FROM users WHERE `id_user` = %s",[cedula])
                result = db_cursor.fetchone()
                request_goal = GoalSerializer(data=request.data)
                if result is not None and instance is not None:
                    try:
                        correo = result[0]
                        nombre = str(result[1]) + ' ' + str(result[2])
                        nombre_encoded = ftfy.fix_text(nombre)
                        decoded_pdf_data = base64.b64decode(pdf_64)
                        email = EmailMessage(
                            f'{delivery_type}',
                                    '<html><body>'
                                    '<div>'
                                    f'<p>Estimado/a {nombre_encoded.title()}:</p>'
                                    f'<p>Se ha procesado su {delivery_type}.<br> Por favor, no responda ni reenvíe este correo. Contiene información confidencial.<br>'
                                    '<div style="color: black;">Cordialmente,<br>'
                                    'M.I.S. Management Information System C&C Services</div></p>'
                                    '</div>'
                                    '</body></html>',
                            f'{delivery_type} <{settings.DEFAULT_FROM_EMAIL}>',
                            [str(correo)],
                        )
                        email.content_subtype = "html"
                        email.attach(f'{delivery_type}.pdf', decoded_pdf_data, "application/pdf")
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
                        connection.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                        # Send the email
                        connection.send_message(email_msg)
                        # Close the connection
                        connection.quit()
                        if delivery_type == "Ejecución de metas":
                            instance.accepted_execution_at = timezone.now()
                            instance.accepted_execution = True
                            instance.save()
                        else:
                            instance.accepted_at = timezone.now()
                            instance.accepted = True
                            instance.save()
                        print("Email sent successfully")
                        return Response({'email': correo}, status=framework_status.HTTP_200_OK)
                    except Exception as e:
                        logger.setLevel(logging.ERROR)
                        logger.exception("Error: %s", str(e))
                        print("Error: %s", str(e))
                        return Response(status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
                # elif (request_goal.is_valid()):
                #     print("Entro al else")
                else:
                    return Response({'Error': "Email not found"}, status=framework_status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(e))
                print("Error: %s", str(e))
                return Response(status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if db_connection is not None and db_connection.is_connected():
                    db_connection.close()   
        else:
            return Response({'Error': f'{"PDF" if not pdf_64 else "Cedula"} not found in the request.'}, status=framework_status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        # Get the file from the request
        file_obj = request.FILES.get('file')
        if file_obj:
            file_name = str(file_obj.name)
            year_pattern = r'\b\d{4}\b'
            month_pattern = r'(?i)(ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE)'
            if not re.search(month_pattern, file_name):
                return Response({"message": "Mes no encontrado en el nombre del archivo."}, status=framework_status.HTTP_400_BAD_REQUEST)
            elif not re.search(year_pattern, file_name):
                return Response({"message": "Año no encontrado en el nombre del archivo."}, status=framework_status.HTTP_400_BAD_REQUEST)
            try:
                date = file_name.split('-')[1].upper() + "-"+ file_name.split('-')[2].split('.')[0]
                # Read the Excel file using openpyxl
                workbook = load_workbook(file_obj, read_only=True, data_only=True)
                sheet = workbook.active
                # Get the column indices based on the header names
                header_row = next(sheet.iter_rows(values_only=True))# type: ignore <- this supress the warning
                header_names = {
                    'CEDULA', 'NOMBRE', 'CARGO', 'CAMPAÑA', 'COORDINADOR A CARGO','ESTADO'
                }
                missing_headers = header_names - set(header_row)
                if missing_headers:
                    return Response({"message": f"Encabezados de columna no encontrados: {', '.join(missing_headers)}"}, status=framework_status.HTTP_400_BAD_REQUEST)
                cedula_index = header_row.index('CEDULA')
                name_index = header_row.index('NOMBRE')
                cargo_index = header_row.index('CARGO')
                campaign_index = header_row.index('CAMPAÑA')
                coordinator_index = header_row.index('COORDINADOR A CARGO')
                status_index = header_row.index('ESTADO')
                if file_name.upper().find('CLARO') != -1:
                    header_names = {
                        'TABLA','OBSERVACIONES',
                    }
                    header_row = next(sheet.iter_rows(values_only=True))# type: ignore <- this supress the warning
                    missing_headers = header_names - set(header_row) # type: ignore <- this supress the warning
                    if missing_headers:
                        return Response({"message": f"Encabezados no encontrados: {', '.join(missing_headers)}"}, status=framework_status.HTTP_400_BAD_REQUEST)
                    table_index = header_row.index('TABLA')
                    observation_index = header_row.index('OBSERVACIONES')
                    sheet = workbook['Tabla_de_valores']
                    header_names = {
                        'FRANJA', 'META DIARIA', 'DIAS', 'META MES CON PAGO', 'POR HORA','RECAUDO POR CUENTA'
                    }
                    header_row = next(sheet.iter_rows(values_only=True))# type: ignore <- this supress the warning
                    missing_headers = header_names - set(header_row) # type: ignore <- this supress the warning
                    if missing_headers:
                        return Response({"message": f"Encabezados no encontrados: {', '.join(missing_headers)}"}, status=framework_status.HTTP_400_BAD_REQUEST)
                    fringe_index = header_row.index('FRANJA')
                    diary_goal_index = header_row.index('META DIARIA')
                    days_index = header_row.index('DIAS')
                    month_goal_index = header_row.index('META MES CON PAGO')
                    hours_index = header_row.index('POR HORA')
                    collection_account_index = header_row.index('RECAUDO POR CUENTA')
                    for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):# type: ignore <- this supress the warning
                        cargo = str(row[cargo_index].value).upper().lstrip('.')
                        if cargo.upper().find('ASESOR') != -1:
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
                            # Update or create the record
                            unique_constraint = 'cedula'
                            default_value = {
                                'name': name,
                                'job_title': cargo,
                                'campaign': campaign,
                                'coordinator': coordinator,
                                'goal_date': date,
                                'observation': observation,
                                'table': table,
                                'status': status,
                            }
                            try:
                                with transaction.atomic():
                                    instance = Goals.objects.filter(cedula=cedula)
                                    if instance.exists():
                                        instance.update(accepted=None, accepted_at=None)
                                    if i == 2:
                                        MultipleGoals.objects.all().delete()
                                    goals_instance, _ = Goals.objects.update_or_create(defaults=default_value, **{unique_constraint: cedula})
                                    # Create the additional info record
                                    fringe = row[fringe_index].value
                                    diary_goal = row[diary_goal_index].value  
                                    days = row[days_index].value
                                    month_goal = row[month_goal_index].value
                                    hours = row[hours_index].value
                                    collection_account = row[collection_account_index].value
                                    observation = row[observation_index].value
                                    MultipleGoals.objects.create(
                                        goals=goals_instance,
                                        fringe=fringe,
                                        diary_goal=diary_goal,
                                        days=days,
                                        month_goal=month_goal,
                                        hours=hours,
                                        collection_account=collection_account,
                                        observation=observation,
                                    )
                            except ValidationError as ve: 
                                logger.setLevel(logging.ERROR)
                                logger.exception("Validation error: %s", str(ve))
                                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=framework_status.HTTP_400_BAD_REQUEST)
                            except Exception as e:
                                logger.setLevel(logging.ERROR)
                                logger.exception("Error: %s", str(e))
                                return Response({"message": "Excel upload Failed.","error": str(e)}, status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
                    return Response({"message": "Excel file uploaded and processed successfully."}, status=framework_status.HTTP_201_CREATED)
                header_names = {
                    'DESCRIPCION DE LA VARIABLE A MEDIR', 'CANTIDAD'
                }
                missing_headers = header_names - set(header_row)
                if missing_headers:
                    return Response({"message": f"Estos encabezados no fueron encontrados: {', '.join(missing_headers)}"}, status=framework_status.HTTP_400_BAD_REQUEST)
                criteria_index = header_row.index('DESCRIPCION DE LA VARIABLE A MEDIR')
                quantity_index = header_row.index('CANTIDAD')
                if file_name.upper().find('EJECUCIÓN') != -1 or file_name.upper().find('EJECUCION') != -1:
                    header_names = {
                        '% CUMPLIMIENTO', 'EVALUACION', 'CALIDAD', 'CLEAN DESK', 'TOTAL'
                    }
                    missing_headers = header_names - set(header_row)
                    if missing_headers:
                        return Response({"message": f"Estos encabezados no fueron encontrados: {', '.join(missing_headers)}"}, status=framework_status.HTTP_400_BAD_REQUEST)
                    result_index = header_row.index('% CUMPLIMIENTO')
                    evaluation_index = header_row.index('EVALUACION')
                    quality_index = header_row.index('CALIDAD')
                    clean_desk_index = header_row.index('CLEAN DESK')
                    total_index = header_row.index('TOTAL')
                else:
                    result_index = None
                    evaluation_index = None
                    quality_index = None
                    clean_desk_index = None
                    total_index = None
                for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):# type: ignore <- this supress the warning
                    cargo = str(row[cargo_index].value)
                    cedula = row[cedula_index]
                    if cargo.upper().find('ASESOR') != -1:
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
                        quantity = row[quantity_index].value
                        observation = row[observation_index].value
                        status = row[status_index].value
                        if file_name.upper().find('EJECUCION') != -1 or file_name.upper().find('EJECUCIÓN') != -1:
                            result_cell = row[result_index]
                            result = format_cell_value(result_cell)
                            evaluation_cell = row[evaluation_index]
                            evaluation = format_cell_value(evaluation_cell)
                            quality = format_cell_value(row[quality_index])
                            clean_desk = format_cell_value(row[clean_desk_index])
                            total = format_cell_value(row[total_index])
                            # default_value['execution_date'] = date
                        else:
                            result = None
                            evaluation = None
                            quality = None
                            clean_desk = None
                            total = None

                        # Update or create the record
                        unique_constraint = 'cedula'
                        default_value = {
                            'name': name,
                            'job_title': cargo,
                            'campaign': campaign,
                            'coordinator': coordinator,
                            'criteria': criteria,
                            'quantity': quantity,
                            'result': result,
                            'quality': quality,
                            'evaluation': evaluation,
                            'clean_desk': clean_desk,
                            'total': total
                        }
                        # Remove empty values from default_value dictionary
                        default_value = {k: v for k, v in default_value.items() if v}
                        instance = Goals.objects.filter(cedula=cedula)
                        if file_name.upper().find('ENTREGA') != -1:
                            default_value['goal_date'] = date
                            if instance.exists():
                                instance.update(accepted=None, accepted_at=None)
                        elif file_name.upper().find('EJECUCION') != -1 or file_name.upper().find('EJECUCIÓN') != -1:
                            default_value['execution_date'] = date
                            if instance.exists():
                                instance.update(accepted_execution=None, accepted_execution_at=None)
                        Goals.objects.update_or_create(defaults=default_value,**{unique_constraint:cedula})
                return Response({"message": "Excel file uploaded and processed successfully."}, status=framework_status.HTTP_201_CREATED)
            except ValidationError as ve:
                logger.setLevel(logging.ERROR)
                logger.exception("Validation error: %s", str(ve))
                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=framework_status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(e))
                return Response({"message": "Excel upload Failed.","error": str(e)}, status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Excel no encontrado."}, status=framework_status.HTTP_400_BAD_REQUEST)