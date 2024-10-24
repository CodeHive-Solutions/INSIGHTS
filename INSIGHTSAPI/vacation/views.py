import base64
import datetime

import pdfkit
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.core.mail import mail_admins, send_mail
from django.db.models import Q
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.utils import create_notification
from users.models import User

from .models import VacationRequest
from .serializers import VacationRequestSerializer


class VacationRequestViewSet(viewsets.ModelViewSet):
    queryset = (
        VacationRequest.objects.all()
        .select_related("user", "uploaded_by")
        .order_by("-created_at")
    )
    serializer_class = VacationRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED and response.data:
            user_request = User.objects.get(pk=request.data["user"])
            create_notification(
                "Solicitud de vacaciones creada",
                f"Se ha creado una solicitud de vacaciones a tu nombre del {response.data['start_date']} al {response.data['end_date']}.",
                user_request,
            )
            if user_request.area.manager:
                create_notification(
                    "Nueva solicitud de vacaciones",
                    f"Se ha creado una nueva solicitud de vacaciones para {user_request.get_full_name()} del {response.data['start_date']} al {response.data['end_date']}.",
                    user_request.area.manager,
                )
                if user_request.area.manager.company_email:
                    send_mail(
                        "Nueva solicitud de vacaciones",
                        f"Se ha creado una nueva solicitud de vacaciones para {user_request.get_full_name()} del {response.data['start_date']} al {response.data['end_date']}. Por favor revisa la solicitud en la intranet.",
                        None,
                        [str(user_request.area.manager.company_email)],
                    )
            email_message = f"""
                Hola {response.data['user']},

                Nos complace informarte que se ha creado una solicitud de vacaciones a tu nombre para las fechas del {datetime.datetime.strptime(response.data['start_date'], "%Y-%m-%d").strftime("%d de %B del %Y")} al {datetime.datetime.strptime(response.data['end_date'], "%Y-%m-%d").strftime("%d de %B del %Y")}.

                Información Adicional:
                1. Aprobación Pendiente: Tu solicitud está pendiente de aprobación. Recibirás una notificación por correo electrónico una vez que tu solicitud sea aprobada o rechazada.
                2. Política de Vacaciones: Recuerda que es tu responsabilidad familiarizarte con nuestra política de vacaciones. Puedes encontrar el documento completo en la intranet sección "Gestión documental" -> "POLÍTICA DISFRUTE DE VACACIONES".
                3. Planificación de Proyectos: Si tienes proyectos pendientes o tareas que necesitan seguimiento durante tu ausencia, por favor coordina con tu equipo para asegurar una transición sin problemas.

                Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con la Gerencia de Recursos Humanos.

                ¡Esperamos que tu solicitud sea aprobada y que disfrutes de unas vacaciones relajantes! ⛱
                """
            html_message = f"""
                <head>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
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
                    <h2>Hola {response.data["user"]},</h2>
                    <p>Nos complace informarte que se ha creado una solicitud de vacaciones a tu nombre para las fechas del <strong>{datetime.datetime.strptime(response.data["start_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}</strong> al <strong>{datetime.datetime.strptime(response.data["end_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}</strong>.</p>
                    <h3>Información Adicional</h3>
                    <ul>
                        <li><strong>Aprobación Pendiente</strong>: Tu solicitud está pendiente de aprobación. Recibirás una notificación por correo electrónico una vez que tu solicitud sea aprobada o rechazada.</li>
                        <li><strong>Política de Vacaciones</strong>: Recuerda que es tu responsabilidad familiarizarte con nuestra política de vacaciones. Puedes encontrar el documento completo en la intranet sección "Gestión documental" -> "POLÍTICA DISFRUTE DE VACACIONES".</li>
                        <li><strong>Planificación de Proyectos</strong>: Si tienes proyectos pendientes o tareas que necesitan seguimiento durante tu ausencia, por favor coordina con tu equipo para asegurar una transición sin problemas.</li>
                    </ul>
                    <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con la Gerencia de Recursos Humanos.</p>
                    <p>¡Esperamos que tu solicitud sea aprobada y que disfrutes de unas vacaciones relajantes! ⛱</p>
                    <div class="footer">
                        <p>Saludos cordiales,</p>
                    </div>
                </body>
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
        # Check if the user is in payroll
        elif request.user.has_perm("vacation.payroll_approval"):
            queryset = self.queryset.all()
        # Check if the user has employee management permissions
        elif request.user.job_position.rank >= 2:
            children = self.request.user.area.get_children()
            # Check if the user is a manager
            if children and request.user.area.manager == request.user:
                queryset = self.queryset.filter(
                    # Check if was uploaded by the user or if the user is the owner
                    (Q(uploaded_by=request.user) | Q(user=request.user))
                    # Check if the user is a manager of the area
                    | (Q(user__area__manager=request.user))
                    # Check if the user is a manager of a child area
                    | (Q(user__area__in=children))
                    | (
                        Q(user__job_position__rank__lt=request.user.job_position.rank)
                        & Q(user__area=request.user.area)
                    )
                )
            else:
                queryset = self.queryset.filter(
                    Q(uploaded_by=request.user)
                    | Q(user=request.user)
                    | (Q(user__area__manager=request.user))
                    | (
                        Q(user__job_position__rank__lt=request.user.job_position.rank)
                        & Q(user__area=request.user.area)
                    )
                )
        # The user is a regular employee
        else:
            queryset = self.queryset.filter(
                Q(uploaded_by=request.user) | Q(user=request.user)
            )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        if isinstance(request.user, AnonymousUser):
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Check if the user is updating the hr_is_approved field
        if "boss_is_approved" in request.data:
            # Check if the user is a manager
            if request.user.job_position.rank >= 2:
                if self.get_object().boss_is_approved is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                response = super().partial_update(request, *args, **kwargs)
                if (
                    response.status_code == status.HTTP_200_OK
                    and response.data
                    and response.data["boss_is_approved"]
                ):
                    manager_user = request.user.area.manager
                    if not manager_user:
                        mail_admins(
                            f"No hay usuarios con el cargo de GERENTE para el área {request.user.area}",
                            f"No hay usuarios con el cargo de GERENTE para el área {request.user.area}",
                        )
                        return response
                    create_notification(
                        "Una solicitud necesita tu aprobación",
                        f"{request.user.get_full_name()} ha aprobado la solicitud de vacaciones de {response.data['user']}. Ahora necesita tu aprobación.",
                        manager_user,
                    )
                return response

            else:
                return Response(
                    {"detail": f"You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "manager_is_approved" in request.data:
            # Check if the user is a manager
            if (
                request.user.job_position.rank >= 5
                and self.get_object().boss_is_approved
            ):
                if self.get_object().manager_is_approved is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                response = super().partial_update(request, *args, **kwargs)
                if (
                    response.status_code == status.HTTP_200_OK
                    and response.data
                    and response.data["manager_is_approved"]
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
                    hr_message = f"""
                        Hola {hr_user.get_full_name()} 👋,

                        {request.user.get_full_name()} ha aprobado la solicitud de vacaciones de {response.data["user"]} la cual fue solicitada para el {datetime.datetime.strptime(response.data["start_date"], "%Y-%m-%d").strftime("%d de %B del %Y")} al {datetime.datetime.strptime(response.data["end_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}.

                        Ahora esta a la espera de tu aprobación. Por favor revisa la solicitud y apruébala si estas de acuerdo con las fechas solicitadas.
                    """
                    send_mail(
                        "Solicitud de vacaciones aprobada por un gerente",
                        hr_message,
                        None,
                        [str(hr_user.company_email)],
                    )
                    payroll_user = User.objects.filter(
                        user_permissions__codename="payroll_is_approved"
                    ).first()
                    if not payroll_user:
                        mail_admins(
                            "No hay usuarios con el permiso de payroll_is_approved",
                            "No hay usuarios con el permiso de payroll_is_approved",
                        )
                        return response
                    create_notification(
                        "Una solicitud de vacaciones ha sido aprobada por un gerente",
                        f"La solicitud de vacaciones de {response.data['user']} ha sido aprobada por {request.user.get_full_name()}. Ahora sera revisada por la Gerencia de Recursos Humanos.",
                        payroll_user,
                    )
                    payroll_message = f"""
                        Hola {payroll_user.get_full_name()} 👋,

                        {request.user.get_full_name()} ha aprobado la solicitud de vacaciones de {response.data["user"]} la cual fue solicitada para el {datetime.datetime.strptime(response.data["start_date"], "%Y-%m-%d").strftime("%d de %B del %Y")} al {datetime.datetime.strptime(response.data["end_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}.

                        Ahora esta a la espera de la aprobación de la Gerencia de Recursos Humanos.
                    """
                    send_mail(
                        "Una solicitud de vacaciones ha sido aprobada por un gerente",
                        payroll_message,
                        None,
                        [str(payroll_user.company_email)],
                    )
                return response

            else:
                return Response(
                    {"detail": f"You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "hr_is_approved" in request.data:
            # Check if the user is an HR and that the manager has already approved the request
            if (
                request.user.job_position.name == "GERENTE DE GESTION HUMANA"
                and self.get_object().manager_is_approved
            ):
                if self.get_object().hr_is_approved is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                response = super().partial_update(request, *args, **kwargs)
                if (
                    response.status_code == status.HTTP_200_OK
                    and response.data
                    and response.data["hr_is_approved"]
                ):
                    payroll_user = User.objects.filter(
                        user_permissions__codename="payroll_approval"
                    ).first()
                    if not payroll_user:
                        mail_admins(
                            "No hay usuarios con el permiso de payroll_approval",
                            "No hay usuarios con el permiso de payroll_approval",
                        )
                        return response
                    create_notification(
                        "Una solicitud de vacaciones necesita tu aprobación",
                        f"La Gerencia de Recursos Humanos ha aprobado la solicitud de vacaciones de {response.data['user']}. Ahora necesita tu aprobación.",
                        payroll_user,
                    )
                    payroll_message = f"""
                        Hola {payroll_user.get_full_name()} 👋,

                        La Gerencia de Recursos Humanos ha aprobado la solicitud de vacaciones de {response.data["user"]} la cual fue solicitada para el {datetime.datetime.strptime(response.data["start_date"], "%Y-%m-%d").strftime("%d de %B del %Y")} al {datetime.datetime.strptime(response.data["end_date"], "%Y-%m-%d").strftime("%d de %B del %Y")}.

                        Ahora esta a la espera de tu aprobación final. Por favor revisa la solicitud y apruébala si estas de acuerdo con las fechas solicitadas.
                    """
                    send_mail(
                        "Solicitud de vacaciones en espera de tu aprobación",
                        payroll_message,
                        None,
                        [str(payroll_user.company_email)],
                    )
                return response
            else:
                return Response(
                    {
                        "detail": f"You do not have permission to perform this action {request.user.job_position.name}."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif "payroll_is_approved" in request.data:
            # Check if the user is in payroll and that the HR has already approved the request
            if (
                request.user.has_perm("vacation.payroll_approval")
                and self.get_object().hr_is_approved
            ):
                if self.get_object().payroll_is_approved is not None:
                    return Response(
                        {"detail": "No puedes modificar esta solicitud."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return super().partial_update(request, *args, **kwargs)
        if (
            "status" in request.data
            and request.user == self.get_object().user
            and request.data["status"] == "CANCELADA"
        ):
            return super().partial_update(request, *args, **kwargs)

        return Response(
            {"detail": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Example link: http://localhost:8000/vacation/1/get-pdf/
    @action(detail=True, methods=["get"], url_path="get-pdf", url_name="get-pdf")
    def generate_pdf(self, request, pk=None):
        context = {
            "vacation": self.get_object(),
            "current_date": timezone.now().strftime("%Y-%m-%d"),
            "company_logo": base64.b64encode(
                open("static/images/just_logo.png", "rb").read()
            ).decode("utf-8"),
        }
        # Import the html template
        rendered_template = render_to_string(
            "vacation_request.html",
            context,
        )
        # PDF options
        options = { 
            "page-size": "Letter",
            "orientation": "portrait",
            "encoding": "UTF-8",
            "margin-top": "0mm",
            "margin-right": "0mm",
            "margin-bottom": "0mm",
            "margin-left": "0mm",
        }
        pdf = pdfkit.from_string(rendered_template, False, options=options)
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = (
            'inline; filename="Solicitud de vacaciones - {}.pdf"'.format(
                self.get_object().user.get_full_name()
            )
        )
        return response
