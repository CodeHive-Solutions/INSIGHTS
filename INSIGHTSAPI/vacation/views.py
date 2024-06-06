from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import VacationRequest
from .serializers import VacationRequestSerializer

class VacationRequestViewSet(viewsets.ModelViewSet):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
