import datetime
from rest_framework import status
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from notifications.utils import create_notification
from django.utils import timezone
from django.core.mail import mail_admins
from django.core.mail import send_mail
from users.models import User
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
            email_message = f"""
                Hola {response.data['user']},

                Nos complace informarte que se ha creado una solicitud de vacaciones a tu nombre para las fechas del {datetime.datetime.strptime(response.data['start_date'], "%Y-%m-%d").strftime("%d de %B del %Y")} al {datetime.datetime.strptime(response.data['end_date'], "%Y-%m-%d").strftime("%d de %B del %Y")}.

                Información Adicional:
                1. **Aprobación Pendiente**: Tu solicitud está pendiente de aprobación. Recibirás una notificación por correo electrónico una vez que tu solicitud sea aprobada o rechazada.
                2. **Política de Vacaciones**: Recuerda que es tu responsabilidad familiarizarte con nuestra política de vacaciones. Puedes encontrar el documento completo en la intranet sección "Gestión documental" > "POLÍTICA DISFRUTE DE VACACIONES".
                3. **Planificación de Proyectos**: Si tienes proyectos pendientes o tareas que necesitan seguimiento durante tu ausencia, por favor coordina con tu equipo para asegurar una transición sin problemas.

                Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con la Gerencia de Recursos Humanos.

                ¡Esperamos que tu solicitud sea aprobada y que disfrutes de unas vacaciones relajantes! ⛱

                Saludos cordiales,
                """
            html_message = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                        }}
                        .container {{
                            margin: 0 auto;
                            padding: 20px;
                            max-width: 600px;
                            border: 1px solid #ccc;
                            border-radius: 10px;
                            background-color: #f9f9f9;
                        }}
                        h2 {{
                            color: #2c3e50;
                        }}
                        p {{
                            color: #34495e;
                        }}
                        ul {{
                            list-style-type: none;
                            padding: 0;
                        }}
                        li {{
                            margin-bottom: 10px;
                        }}
                        li::before {{
                            content: "•";
                            color: #3498db;
                            font-weight: bold;
                            display: inline-block;
                            width: 1em;
                            margin-left: -1em;
                        }}
                        .footer {{
                            margin-top: 20px;
                            font-size: 0.9em;
                            color: #95a5a6;
                        }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Hola {response.data["user"]},</h2>
                        <p>Nos complace informarte que se ha creado una solicitud de vacaciones a tu nombre para las fechas del <strong>{datetime.datetime.strptime(response.data["start_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}</strong> al <strong>{datetime.datetime.strptime(response.data["end_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}</strong>.</p>

                        <h3>Información Adicional</h3>
                        <ul>
                            <li><strong>Aprobación Pendiente</strong>: Tu solicitud está pendiente de aprobación. Recibirás una notificación por correo electrónico una vez que tu solicitud sea aprobada o rechazada.</li>
                            <li><strong>Política de Vacaciones</strong>: Recuerda que es tu responsabilidad familiarizarte con nuestra política de vacaciones. Puedes encontrar el documento completo en la intranet sección "Gestión documental" > "POLÍTICA DISFRUTE DE VACACIONES".</li>
                            <li><strong>Planificación de Proyectos</strong>: Si tienes proyectos pendientes o tareas que necesitan seguimiento durante tu ausencia, por favor coordina con tu equipo para asegurar una transición sin problemas.</li>
                        </ul>

                        <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con la Gerencia de Recursos Humanos.</p>

                        <p>¡Esperamos que tu solicitud sea aprobada y que disfrutes de unas vacaciones relajantes! ⛱</p>

                        <div class="footer">
                            <p>Saludos cordiales,</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            send_mail(
                "Solicitud de vacaciones",
                email_message,
                None,
                [str(User.objects.get(pk=request.data["user"]).email)],
                html_message=html_message,
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
                if self.get_object().manager_approbation is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
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
                        "Una solicitud de vacaciones ha sido aprobada por un gerente",
                        f"La solicitud de vacaciones de {response.data['user']} ha sido aprobada por {request.user.get_full_name()}. Ahora sera revisada por la Gerencia de Recursos Humanos.",
                        payroll_user,
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
                if self.get_object().hr_approbation is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
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
                if self.get_object().payroll_approbation is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return super().partial_update(request, *args, **kwargs)
        # Just allow the owner of the request to update the status
        # elif "status" in request.data and request.user == self.get_object().uploaded_by:
        #     return super().partial_update(request, *args, **kwargs)
        return Response(
            {"detail": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )
