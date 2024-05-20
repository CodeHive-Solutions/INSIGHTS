from rest_framework import generics
from .models import VacationRequest
from .serializers import VacationRequestSerializer

class VacationRequestCreateView(generics.CreateAPIView):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer

class VacationRequestListView(generics.ListAPIView):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
