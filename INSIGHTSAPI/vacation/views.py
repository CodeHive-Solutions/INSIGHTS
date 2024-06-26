from rest_framework import status
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VacationRequest
from .serializers import VacationRequestSerializer


class VacationRequestViewSet(viewsets.ModelViewSet):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if request.user.job_position.name == "GERENTE DE GESTION HUMANA":
            queryset = self.queryset.all()
        elif request.user.job_position.rank >= 5:
            queryset = self.queryset.filter(
                (Q(uploaded_by=request.user) | Q(user=request.user))
                | (
                    Q(user__job_position__rank__lt=request.user.job_position.rank)
                    & Q(user__area=request.user.area)
                )
            )
        elif request.user.has_perm("vacation.payroll_approbation"):
            queryset = self.queryset.all()
        else:
            queryset = self.queryset.filter(
                Q(uploaded_by=request.user) | Q(user=request.user)
            )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        # Check if the user is updating the hr_approbation field
        if "manager_approbation" in request.data:
            # Check if the user is a manager
            if request.user.job_position.rank >= 5:
                return super().partial_update(request, *args, **kwargs)
            else:
                return Response(
                    {"detail": "You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "hr_approbation" in request.data:
            # Check if the user is an HR
            if request.user.job_position.name == "GERENTE DE GESTION HUMANA":
                return super().partial_update(request, *args, **kwargs)
            else:
                return Response(
                    {"detail": "You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "payroll_approbation" in request.data:
            # Check if the user is in payroll
            if request.user.has_perm("vacation.payroll_approbation"):
                return super().partial_update(request, *args, **kwargs)
        # Just allow the owner of the request to update the status
        elif "status" in request.data and request.user == self.get_object().uploaded_by:
            return super().partial_update(request, *args, **kwargs)
        return Response(
            {"detail": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )
