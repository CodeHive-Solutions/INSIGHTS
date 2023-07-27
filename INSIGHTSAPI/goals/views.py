import logging
import os
import re
import traceback
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
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Goals, MultipleGoals
from .serializers import GoalSerializer

logger = logging.getLogger("requests")
console = logging.getLogger("console")

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
                db_connection = mysql.connector.connect(
                    host="172.16.0.6",
                    user="root",
                    password=os.getenv('LEYES'),
                    database="userscyc",
                    port="3306"
                    )
                db_cursor = db_connection.cursor()
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
                        return Response({'email': correo}, status=status.HTTP_200_OK)
                    except Exception as e:
                        logger.setLevel(logging.ERROR)
                        logger.exception("Error: %s", str(e))
                        print("Error: %s", str(e))
                        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                elif (request_goal.is_valid()):
                    print("Entro al else")
                else:
                    return Response({'Error': "Email not found"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(e))
                print("Error: %s", str(e))
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if db_connection is not None and db_connection.is_connected():
                    db_connection.close()   
        else:
            return Response({'Error': f'{"PDF" if not pdf_64 else "Cedula"} not found in the request.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        # Get the file from the request
        file_obj = request.FILES.get('file')
        console.info("File: %s", file_obj)
        if file_obj:
            file_name = str(file_obj.name)
            try:
                # Read the Excel file using openpyxl
                workbook = load_workbook(file_obj, read_only=True, data_only=True)
                sheet = workbook.active
                # Get the column indices based on the header names
                header_row = next(sheet.iter_rows(values_only=True))# type: ignore <- this supress the warning
                header_names = {
                    'CEDULA', 'NOMBRE', 'CARGO', 'CAMPAÑA', 'COORDINADOR A CARGO',
                }
                missing_headers = header_names - set(header_row)
                if missing_headers:
                    return Response({"message": f"Headers are missing in the Excel file: {', '.join(missing_headers)}"}, status=status.HTTP_400_BAD_REQUEST)
                cedula_index = header_row.index('CEDULA')
                name_index = header_row.index('NOMBRE')
                cargo_index = header_row.index('CARGO')
                campaign_index = header_row.index('CAMPAÑA')
                coordinator_index = header_row.index('COORDINADOR A CARGO')
                if file_name.find('Claro') != -1:
                    print('Entro al if')
                    header_names = {
                        'EDAD NUEVO', 'META DIARIA', 'DIAS', 'META MES CON PAGO', 'POR HORA', 'OBSERVACIÓN'
                    }
                    missing_headers = header_names - set(header_row)
                    if missing_headers:
                        return Response({"message": f"Headers are missing in the Excel file: {', '.join(missing_headers)}"}, status=status.HTTP_400_BAD_REQUEST)
                    new_age_index = header_row.index('EDAD NUEVO')
                    diary_goal_index = header_row.index('META DIARIA')
                    days_index = header_row.index('DIAS')
                    month_goal_index = header_row.index('META MES CON PAGO')
                    hours_index = header_row.index('POR HORA')
                    observation_index = header_row.index('OBSERVACIÓN')
                    for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):# type: ignore <- this supress the warning
                        cargo = str(row[cargo_index].value).upper().lstrip('.')
                        cedula = row[cedula_index]
                        if cargo.find('ASESOR'):
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
                            # Update or create the record
                            unique_constraint = 'cedula'
                            default_value = {
                                'name': name,
                                'job_title': cargo,
                                'campaign': campaign,
                                'coordinator': coordinator,
                            }
                            try:
                                with transaction.atomic():
                                    if i == 2:
                                        Goals.objects.all().update(accepted=None, accepted_at=None)
                                        MultipleGoals.objects.all().delete()
                                        print(MultipleGoals.objects.all().count())
                                    goals_instance, _ = Goals.objects.update_or_create(defaults=default_value, **{unique_constraint: cedula})
                                    # Create the additional info record
                                    age_news = row[new_age_index].value
                                    diary_goal = row[diary_goal_index].value
                                    days = row[days_index].value
                                    month_goal = row[month_goal_index].value
                                    hours = row[hours_index].value
                                    observation = row[observation_index].value
                                    MultipleGoals.objects.create(
                                        goals=goals_instance,
                                        age_news=age_news,
                                        diary_goal=diary_goal,
                                        days=days,
                                        month_goal=month_goal,
                                        hours=hours,
                                        observation=observation,
                                    )
                            except ValidationError as ve:
                                logger.setLevel(logging.ERROR)
                                logger.exception("Validation error: %s", str(ve))
                                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
                            except Exception as e:
                                logger.setLevel(logging.ERROR)
                                logger.exception("Error: %s", str(e))
                                return Response({"message": "Excel upload Failed.","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
                criteria_index = header_row.index('DESCRIPCION DE LA VARIABLE A MEDIR')
                quantity_index = header_row.index('CANTIDAD')
                if file_name.find('Ejecución'):
                    result_index = header_row.index('% CUMPLIMIENTO ')
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
                    cargo = str(row[cargo_index].value).upper().lstrip('.')
                    cedula = row[cedula_index]
                    if cargo.find('ASESOR'):
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
                        if file_name.find('Ejecución'):
                            result_cell = row[result_index]
                            result = format_cell_value(result_cell)
                            evaluation_cell = row[evaluation_index]
                            evaluation = format_cell_value(evaluation_cell)
                            quality = format_cell_value(row[quality_index])
                            clean_desk = format_cell_value(row[clean_desk_index])
                            total = format_cell_value(row[total_index])
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
                        if file_name.find('entrega') and i == 2:
                            Goals.objects.all().update(accepted=None, accepted_at=None)
                        if file_name.find('ejecucion') and i == 2:
                            Goals.objects.all().update(accepted_execution=None, accepted_execution_at=None)
                        Goals.objects.update_or_create(defaults=default_value,**{unique_constraint:cedula})
                return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
            except ValidationError as ve:
                logger.setLevel(logging.ERROR)
                logger.exception("Validation error: %s", str(ve))
                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(e))
                my_model_instance = Goals(field1="value1", field2="value2")
                is_valid = my_model_instance.clean()
                return Response({"message": "Excel upload Failed.","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # elif Goals.validate()
        
        else:
            return Response({"message": "Excel no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

    # def finalize_response(self, request, response, *args, **kwargs):
    #     logger.info("Request: %s", request)
    #     if hasattr(response, 'data') and response.data and request.resolver_match.route != "goals/$":
    #         logger.info("Response Content: %s", response.data)
    #     else:
    #         logger.info("Response: %s", response)
    #     return super().finalize_response(request, response, *args, **kwargs)