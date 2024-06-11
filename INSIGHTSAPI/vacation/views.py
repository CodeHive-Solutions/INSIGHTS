from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VacationRequest
from .serializers import VacationRequestSerializer

class VacationRequestViewSet(viewsets.ModelViewSet):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        # Check if the user is updating the hr_approved field
        if 'hr_approved' in request.data:
            # Check if the user is an HR
            if request.user.job_position.name == 'GERENTE DE GESTION HUMANA':
                return super().partial_update(request, *args, **kwargs)
            else:
                return Response(
                    {"detail": "You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        # Just allow the owner of the request to update the status
        elif "status" in request.data and request.user == self.get_object().uploaded_by:
            return super().partial_update(request, *args, **kwargs)
        else:
            return Response(
                {"detail": "You can only update the hr_approved field."},
                status=status.HTTP_400_BAD_REQUEST,
            )