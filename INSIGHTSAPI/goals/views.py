import logging
import json
from django.utils import timezone
from openpyxl import load_workbook
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Goal, PersonGoals
from .serializers import GoalSerializer, PersonSerializer
from pytz import timezone as pytz_timezone

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        print(timezone.now())
        print(timezone.get_current_timezone())
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        data = request.data
        print("data",data)
        if isinstance(data, list):
            for data in data:
                campaign = data['campaign']
                print("Campaign",campaign)
                value = data['value']
                print("Value",value)
                Goal.objects.update_or_create(
                    campaign=campaign,
                    defaults={'value': value, 'created_at': timezone.now()},
                )
        else:
            print("STRING")
            campaign = data['campaign']
            value = data['value']
            Goal.objects.update_or_create(
                campaign=campaign,
                defaults={'value': value, 'created_at': timezone.now()}
            )
        status_code = status.HTTP_201_CREATED
        return Response(status=status_code)




    def finalize_response(self, request, response, *args, **kwargs):
        if hasattr(response, 'data'):
            logger.debug("Request Attributes: %s", request.data)
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Request Attributes: %s", request.data)
            logger.debug("Response Content: %s", response.content)
        return super().finalize_response(request, response, *args, **kwargs)

class ExcelGoalsViewSet(viewsets.ModelViewSet):
    queryset = PersonGoals.objects.all()
    serializer_class = PersonSerializer
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
                return Response({"message": "Excel upload Failed.","error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"message": "Excel upload Failed.", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
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
