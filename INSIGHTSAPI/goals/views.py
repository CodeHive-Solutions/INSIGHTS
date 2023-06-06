import logging
from rest_framework.parsers import MultiPartParser
import pandas as pd
import re
from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Goal, Person
from .serializers import GoalSerializer

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

    def finalize_response(self, request, response, *args, **kwargs):
        if hasattr(response, 'data'):
            logger.debug("Request Attributes: %s", request.data)
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Request Attributes: %s", request.data)
            logger.debug("Response Content: %s", response.content)
        return super().finalize_response(request, response, *args, **kwargs)

class ExcelUploadView(APIView):
    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                # Read the Excel file using pandas
                df = pd.read_excel(file_obj, engine='xlrd')
                for index, row in df.iterrows():
                    if str(row['CARGO']).upper().startswith('ASESOR') and row['CEDULA'] not in [1036643038,1000470924,1033821108]:
                        cedula = row['CEDULA']
                        name = row['NOMBRE']
                        campaign = row['CARGO']
                        # result = re.sub(r'\D', '', str(row['% CUMPLIMIENTO ']))
                        # evaluation = re.sub(r'\D', '', str(row['EVALUACION']))
                        # quality = re.sub(r'\D', '', str(row['CALIDAD']))
                        # clean_desk = re.sub(r'\D', '', str(row['CLEAN DESK']))
                        result = "{:.2f}".format(row['% CUMPLIMIENTO '])
                        evaluation = "{:.2f}".format(row['EVALUACION'])
                        quality = "{:.2f}".format(row['CALIDAD'])
                        clean_desk = "{:.2f}".format(row['CLEAN DESK'])
                        print("Total_",row['TOTAL'])
                        total = "{:.2f}".format(row['TOTAL'])
                        # total = Decimal(re.sub(r'[^0-9.,]', '', str(row['TOTAL'])).replace(',', '.'))
                        print(total)
                        # Create and save the Person object
                        person = Person(
                            cedula=cedula,
                            name=name,
                            campaign=campaign,
                            result=result,
                            evaluation=evaluation,
                            quality=quality,
                            cleand_desk=clean_desk,
                            total=total
                        )
                        print(person)
                        person.save()
                return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Excel upload Failed.","Asesor":str(person), "error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(dir(request))
            return Response({"message": "Excel Failed."}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        persons = Person.objects.all()
        serializer = PersonSerializer(persons, many=True)
        return Response(serializer.data)

    def finalize_response(self, request, response, *args, **kwargs):
        if hasattr(response, 'FILES'):
            logger.debug("Request Attributes: %s", request.FILES)
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Request Attributes: %s", request.FILES)
            logger.debug("Response Content: %s", response.data)
        return super().finalize_response(request, response, *args, **kwargs)
