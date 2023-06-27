import logging
import re
import traceback
from django.utils import timezone
import ssl
import ftfy
from smtplib import SMTP
import base64
import mysql.connector
from reportlab.pdfgen import canvas
from django.conf import settings
from django.core.mail import EmailMessage
from openpyxl import load_workbook
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Goals
from .serializers import PersonSerializer
from django.db.models import Q

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class GoalsViewSet(viewsets.ModelViewSet):
    queryset = Goals.objects.all()
    serializer_class = PersonSerializer
    
    # Trying handle get requests
    # def get_queryset(self):
    #     queryset = Goals.objects.all()
    #     coordinator = self.request.query_params.get('coordinator', None)
    #     if coordinator is not None:
    #         # split the coordinator name into first name and last name
    #         first_name, last_name = coordinator.split(' ', 1)
    #         # filter the queryset based on possible name formats
    #         queryset = queryset.filter(
    #             Q(coordinator=coordinator) |
    #             Q(coordinator__startswith=first_name) |
    #             Q(coordinator__endswith=last_name)
    #         )
    #     return queryset
    
    # Trying handle patch requests 
    # def partial_update(self, request, *args, **kwargs):
        # instance = self.get_object()
        # serializer = self.get_serializer(instance, data=request.data, partial=True)
        # serializer.is_valid(raise_exception=True)
        # self.perform_update(serializer)
        # return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def send_email(self, request, *args, **kwargs):
        pdf_64 = request.POST.get('pdf')
        print(pdf_64)
        decoded_pdf_data = base64.b64decode(pdf_64)
        with open('output.pdf', 'wb') as f:
            f.write(decoded_pdf_data)
        cedula = request.POST.get('cedula')
        delivery_type = request.POST.get('delivery_type')
        db_connection = None
        db_cursor = None
        if pdf_64 and cedula and delivery_type:
            try:
                db_connection = mysql.connector.connect(
                host='172.16.0.6',
                user='root',
                password='*4b0g4d0s4s*',
                # password='os.environ.get('MYSQL_6')',
                database='userscyc',
                )
                db_cursor = db_connection.cursor()
                instance = Goals.objects.get(cedula=cedula)
                db_cursor.execute("SELECT email_user, pnom_user, pape_user FROM users WHERE `id_user` = %s",[cedula])
                result = db_cursor.fetchone()
                if result is not None:
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
                        return Response({'email': correo})
                    except Exception as e:
                        logger.error("Error: %s", str(e), exc_info=True)
                        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({'Error': "Email not found"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error("Error: %s", str(e), exc_info=True)
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if db_connection and db_connection.is_connected() and db_cursor:
                    db_cursor.close()
                    db_connection.close()   
        else:
            return Response({'Error': f'{"PDF" if pdf_64 else "Cedula"} not found.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        # Get the file from the request
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                # Read the Excel file using openpyxl
                workbook = load_workbook(file_obj, read_only=True, data_only=True)
                sheet = workbook.active
                # Get the column indices based on the header names
                header_row = next(sheet.iter_rows(values_only=True))# type: ignore <- this supress the warning
                cedula_index = header_row.index('CEDULA')
                name_index = header_row.index('NOMBRE')
                cargo_index = header_row.index('CARGO')
                campaign_index = header_row.index('CAMPAÑA')
                coordinator_index = header_row.index('Coordinador a Cargo')
                criteria_index = header_row.index('Descripción de la Variable a Medir')
                quantity_index = header_row.index('Cantidad')
                result_index = header_row.index('% CUMPLIMIENTO ')
                evaluation_index = header_row.index('EVALUACION')
                quality_index = header_row.index('CALIDAD')
                clean_desk_index = header_row.index('CLEAN DESK')
                total_index = header_row.index('TOTAL')
                for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):# type: ignore <- this supress the warning
                    cargo = str(row[cargo_index].value).upper().lstrip('.')
                    cedula = row[cedula_index]
                    if cargo.startswith('ASESOR'):
                        cedula = row[cedula_index].value
                        name = row[name_index].value
                        coordinator = row[coordinator_index].value
                        campaign = row[campaign_index].value
                        criteria = row[criteria_index].value
                        quantity = row[quantity_index].value
                        result_cell = row[result_index]
                        result = "{:.2%}".format(result_cell.value)
                        # Avoid NoneType error
                        evaluation_cell = row[evaluation_index]
                        def format_cell_value(cell):
                            if cell.value is None:
                                return ""
                            else:
                                return "{:.2%}".format(cell.value)

                        evaluation = format_cell_value(evaluation_cell)
                        quality = format_cell_value(row[quality_index])
                        clean_desk = format_cell_value(row[clean_desk_index])
                        total = format_cell_value(row[total_index])
                        
                        goals = None
                        if goals:
                            goals = Goals.objects.get(cedula=cedula)
                            if goals.accepted_execution == 0:
                                goals.accepted_execution_at = None
                                goals.accepted_execution = None
                            if goals.accepted == 0:
                                goals.accepted_at = None
                                goals.accepted = None
                            if goals.accepted == 1 and goals.accepted_execution == 1:
                                goals.accepted_at = None
                                goals.accepted = None
                            if goals.accepted_execution == 1 and goals.total != "":
                                goals.accepted_execution_at = None
                                goals.accepted_execution = None
                            goals.save()
                        # Update or create the record
                        # Update or create the record
                        unique_constraint = 'cedula'
                        defaults = {}
                        if name != '':
                            defaults['name'] = name
                        if cargo != '':
                            defaults['job_title'] = cargo
                        if campaign != '':
                            defaults['campaign'] = campaign
                        if coordinator != '':
                            defaults['coordinator'] = coordinator
                        if criteria != '':
                            defaults['criteria'] = criteria
                        if quantity != '':
                            defaults['quantity'] = quantity
                        if result != '':
                            defaults['result'] = result
                        if evaluation != '':
                            defaults['evaluation'] = evaluation
                        if quality != '':
                            defaults['quality'] = quality
                        if clean_desk != '':
                            defaults['clean_desk'] = clean_desk
                        if total != '':
                            defaults['total'] = total
                        Goals.objects.update_or_create(defaults=defaults,**{unique_constraint:cedula})
                        
                return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
            except ValueError:
                traceback_msg = traceback.format_exc(limit=1)
                logger.error("Value error: %s", traceback_msg, exc_info=True)
                line_match = re.search(r"header_row\.index\('([^']+)'\)", traceback_msg)
                if line_match:
                    line_match = line_match.group(1)
                    return Response({"message": f"Hubo un error al obtener la columna {line_match} asegurate de que este bien escrita."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message':"An error occurred"}, status=status.HTTP_400_BAD_REQUEST)
            except ValidationError as ve:
                logger.error("Validation error: %s", str(ve), exc_info=True)
                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error("Error: %s", str(e), exc_info=True)
                return Response({"message": "Excel upload Failed.","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Excel no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

    def finalize_response(self, request, response, *args, **kwargs):
        logger.debug("Request: %s", request)
        if hasattr(response, 'data') and response.data:
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Response: %s", response)
        return super().finalize_response(request, response, *args, **kwargs)


# class GoalViewSet(viewsets.ModelViewSet):
#     queryset = Goal.objects.all()
#     serializer_class = GoalSerializer

#     def get_serializer(self, *args, **kwargs):
#         if isinstance(kwargs.get('data', {}), list):
#             kwargs['many'] = True
#         return super().get_serializer(*args, **kwargs)

#     def create(self, request, *args, **kwargs):
#         print(timezone.now())
#         print(timezone.get_current_timezone())
#         serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
#         data = request.data
#         print("data",data)
#         if isinstance(data, list):
#             for data in data:
#                 campaign = data['campaign']
#                 print("Campaign",campaign)
#                 value = data['value']
#                 print("Value",value)
#                 Goal.objects.update_or_create(
#                     campaign=campaign,
#                     defaults={'value': value, 'created_at': timezone.now()},
#                 )
#         else:
#             print("STRING")
#             campaign = data['campaign']
#             value = data['value']
#             Goal.objects.update_or_create(
#                 campaign=campaign,
#                 defaults={'value': value, 'created_at': timezone.now()}
#             )
#         status_code = status.HTTP_201_CREATED
#         return Response(status=status_code)




#     def finalize_response(self, request, response, *args, **kwargs):
#         if hasattr(response, 'data'):
#             logger.debug("Request Attributes: %s", request.data)
#             logger.debug("Response Content: %s", response.data)
#         else:
#             logger.debug("Request Attributes: %s", request.data)
#             logger.debug("Response Content: %s", response.content)
#         return super().finalize_response(request, response, *args, **kwargs)