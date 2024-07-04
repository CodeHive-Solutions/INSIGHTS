from rest_framework import status
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from notifications.utils import create_notification
from django.core.mail import mail_admins
from users.models import User
from django.contrib.auth.models import Permission
from .models import VacationRequest
from .serializers import VacationRequestSerializer


class VacationRequestViewSet(viewsets.ModelViewSet):
    queryset = VacationRequest.objects.all()
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED and response.data:
            create_notification(
                "Solicitud de vacaciones creada",
                f"Se ha creado una solicitud de vacaciones a tu nombre del {response.data['start_date']} al {response.data['end_date']}.",
                User.objects.get(pk=request.data["user"]),
            )

        return response

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
                response = super().partial_update(request, *args, **kwargs)
                if (
                    response.status_code == status.HTTP_200_OK
                    and response.data
                    and response.data["manager_approbation"]
                ):
                    hr_user = User.objects.filter(
                        job_position__name="GERENTE DE GESTION HUMANA"
                    ).first()
                    if not hr_user:
                        mail_admins(
                            "No hay usuarios con el cargo de GERENTE DE GESTION HUMANA",
                            "No hay usuarios con el cargo de GERENTE DE GESTION HUMANA",
                        )
                        return response
                    create_notification(
                        "Una solicitud necesita tu aprobación",
                        f"{request.user.get_full_name()} ha aprobado la solicitud de vacaciones de {response.data['user']}. Ahora necesita tu aprobación.",
                        hr_user,
                    )
                return response

            else:
                return Response(
                    {"detail": f"You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "hr_approbation" in request.data:
            # Check if the user is an HR and that the manager has already approved the request
            if (
                request.user.job_position.name == "GERENTE DE GESTION HUMANA"
                and self.get_object().manager_approbation
            ):
                response = super().partial_update(request, *args, **kwargs)
                if (
                    response.status_code == status.HTTP_200_OK
                    and response.data
                    and response.data["hr_approbation"]
                ):
                    payroll_user = User.objects.filter(
                        user_permissions__codename="payroll_approbation"
                    ).first()
                    if not payroll_user:
                        mail_admins(
                            "No hay usuarios con el permiso de payroll_approbation",
                            "No hay usuarios con el permiso de payroll_approbation",
                        )
                        return response
                    create_notification(
                        "Una solicitud de vacaciones necesita tu aprobación",
                        f"La Gerencia de Recursos Humanos ha aprobado la solicitud de vacaciones de {response.data['user']}. Ahora necesita tu aprobación.",
                        payroll_user,
                    )
                return response
            else:
                return Response(
                    {
                        "detail": f"You do not have permission to perform this action {request.user.job_position.name}."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "payroll_approbation" in request.data:
            # Check if the user is in payroll and that the HR has already approved the request
            if (
                request.user.has_perm("vacation.payroll_approbation")
                and self.get_object().hr_approbation
            ):
                return super().partial_update(request, *args, **kwargs)
        # Just allow the owner of the request to update the status
        elif "status" in request.data and request.user == self.get_object().uploaded_by:
            return super().partial_update(request, *args, **kwargs)
        return Response(
            {"detail": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )
