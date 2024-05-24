from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import VacationRequest
from .serializers import VacationRequestSerializer

class VacationRequestCreateView(generics.CreateAPIView):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

class VacationRequestListView(generics.ListAPIView):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

class VacationRequestRetrieveView(generics.RetrieveAPIView):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]
