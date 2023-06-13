import logging
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
from .models import PersonGoals
from .serializers import PersonSerializer
from pytz import timezone as pytz_timezone

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class ExcelGoalsViewSet(viewsets.ModelViewSet):
    queryset = PersonGoals.objects.all()
    serializer_class = PersonSerializer

    @action(detail=False, methods=['post'])
    def send_email(self, request, *args, **kwargs):
        pdf_64 = request.POST.get('pdf')
        cedula = request.POST.get('cedula')
        moment = request.POST.get('moment')
        if pdf_64 and cedula and moment:
            try:
                db_connection = mysql.connector.connect(
                host='172.16.0.6',
                user='root',
                password='*4b0g4d0s4s*',
                # password='os.environ.get('MYSQL_6')',
                database='userscyc',
                )
                db_cursor = db_connection.cursor()
                db_cursor.execute("SELECT email_user FROM users WHERE `id_user` = %s",[cedula])
                result = db_cursor.fetchone()
                if result is not None:
                    correo = result[0]
                    decoded_pdf_data = base64.b64decode(pdf_64)
                    email = EmailMessage(
                        f'{moment}',
                        'Attached is the PDF you requested',
                        f'{moment} <{settings.DEFAULT_FROM_EMAIL}>',
                        [correo],
                    )
                    email.attach(f'{moment}.pdf', decoded_pdf_data, 'application/pdf')
                    email.send()
                    return Response({'message': 'Email sent successfully'})
                else:
                    return Response({'Error': "Email not found"}, status=status.HTTP_400_BAD_REQUEST)
            except mysql.connector.Error as e:
                logger.error("Database error: %s", str(e), exc_info=True)
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if db_connection.is_connected():
                    db_cursor.close()
                    db_connection.close()
        else:
            return Response({'Error': 'PDF not found or cedula not send.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                # Read the Excel file using openpyxl
                workbook = load_workbook(file_obj, read_only=True, data_only=True)
                sheet = workbook.active
                # Get the column indices based on the header names
                header_row = next(sheet.iter_rows(values_only=True))
                cedula_index = header_row.index('CEDULA')
                name_index = header_row.index('NOMBRE')
                cargo_index = header_row.index('CARGO')
                campaign_index = header_row.index('CAMPAÑA')
                criteria_index = header_row.index('Descripción de la Variable a Medir')
                quantity_index = header_row.index('Cantidad')
                result_index = header_row.index('% CUMPLIMIENTO ')
                evaluation_index = header_row.index('EVALUACION')
                quality_index = header_row.index('CALIDAD')
                clean_desk_index = header_row.index('CLEAN DESK')
                total_index = header_row.index('TOTAL')
                for i, row in enumerate(sheet.iter_rows(min_row=2), start=2):
                    cargo = str(row[cargo_index].value).upper().lstrip('.')
                    cedula = row[cedula_index]
                    if cargo.startswith('ASESOR'):
                        cedula = row[cedula_index].value
                        name = row[name_index].value
                        campaign = row[campaign_index].value
                        criteria = row[criteria_index].value
                        quantity_cell = row[quantity_index]
                        quantity = "{:.2%}".format(quantity_cell.value)
                        result_cell = row[result_index]
                        result = "{:.2%}".format(result_cell.value)
                        evaluation_cell = row[evaluation_index]
                        evaluation = "{:.2%}".format(evaluation_cell.value)
                        quality_cell = row[quality_index]
                        quality = "{:.2%}".format(quality_cell.value)
                        clean_desk_cell = row[clean_desk_index]
                        clean_desk = "{:.2%}".format(clean_desk_cell.value)
                        total_cell = row[total_index]
                        total = "{:.2%}".format(total_cell.value)
                        unique_constraint = 'cedula'
                        PersonGoals.objects.update_or_create(
                            defaults={
                            'name':name,
                            'job_title':cargo,
                            'campaign':campaign,
                            'criteria':criteria,
                            'quantity':quantity,
                            'result':result,
                            'evaluation':evaluation,
                            'quality':quality,
                            'clean_desk':clean_desk,
                            'total':total
                            },
                            **{unique_constraint:cedula}
                        )
                return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
            except ValidationError as ve:
                logger.error("Validation error: %s", str(ve), exc_info=True)
                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Excel Failed."}, status=status.HTTP_400_BAD_REQUEST)

    def finalize_response(self, request, response, *args, **kwargs):
        if hasattr(request, 'FILES'):
            logger.debug("Request Attributes: %s", request)
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Request Attributes: %s", request)
            logger.debug("Response Content: %s", response.data)
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