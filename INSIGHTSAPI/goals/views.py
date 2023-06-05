import logging
from rest_framework.parsers import MultiPartParser
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Goal
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
        if hasattr(request, 'FILES'):
            file_obj = request.FILES['file']  # Assuming the file input name is 'file'
            # Read the Excel file using pandas
            df = pd.read_excel(file_obj)
            print(df)
            return Response({"message": "Excel file uploaded and processed successfully."}, status=status.HTTP_200_OK)
        else:
            print(dir(request))
            return Response({"message": "Excel Failed."}, status=status.HTTP_200_OK)

    def finalize_response(self, request, response, *args, **kwargs):
        if hasattr(response, 'FILES'):
            logger.debug("Request Attributes: %s", request.FILES)
            logger.debug("Response Content: %s", response.data)
        else:
            logger.debug("Request Attributes: %s", request.FILES)
            logger.debug("Response Content: %s", response.data)
        return super().finalize_response(request, response, *args, **kwargs)
