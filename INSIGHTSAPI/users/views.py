import os
import csv
import logging
import requests
import sys
from notifications.utils import create_notification
from django.db import connections
from rest_framework.decorators import api_view
from django.db.models import Q
from django.conf import settings
from django.core.validators import validate_email
from django.core.mail import mail_admins
from django.contrib.auth.decorators import permission_required
from rest_framework.response import Response
from users.models import User

logger = logging.getLogger("requests")


def login_staffnet():
    """Do a request to the StaffNet API to login the user."""
    data = {
        "user": "staffnet",
        "password": os.environ["StaffNetLDAP"],
    }
    if "test" in sys.argv or settings.DEBUG:
        url = "https://staffnet-api-dev.cyc-bpo.com/login"
    else:
        url = "https://staffnet-api.cyc-bpo.com/login"
    response = requests.post(url, json=data)
    if (
        response.status_code != 200
        or "StaffNet" not in response.cookies
        and os.environ.get("StaffNetToken")
    ):
        logger.error("Error logging in StaffNet: {}".format(response.text))
        mail_admins(
            "Error logging in StaffNet",
            "Error logging in StaffNet: {}".format(response.text),
        )
        if os.environ.get("StaffNetToken"):
            # delete the token to try to login again
            del os.environ["StaffNetToken"]
        return None
    os.environ["StaffNetToken"] = response.cookies["StaffNet"]
    return True


@api_view(["GET"])
def get_profile(request):
    """Do a request to the StaffNet API to get the user profile."""
    if not request.user.is_authenticated:
        return Response(
            {
                "error": "No tienes permisos para acceder a esta información, por favor inicia sesión."
            },
            status=401,
        )

    if os.environ.get("StaffNetToken") is None:
        if not login_staffnet():
            return Response(
                {
                    "error": "Encontramos un error obteniendo tu perfil, por favor intenta más tarde."
                },
                status=500,
            )
    user = request.user
    if "test" in sys.argv or settings.DEBUG:
        url = "https://staffnet-api-dev.cyc-bpo.com/personal-information/{}"
    else:
        url = "https://staffnet-api.cyc-bpo.com/personal-information/{}"
    response = requests.get(
        url.format(user.cedula),
        cookies={"StaffNet": os.environ["StaffNetToken"]},
    )
    if response.status_code != 200 or "error" in response.json():
        # delete the token to try to login again
        del os.environ["StaffNetToken"]
        login_staffnet()
        response = requests.get(
            url.format(user.cedula),
            cookies={"StaffNet": os.environ["StaffNetToken"]},
        )
    if response.status_code != 200 or "error" in response.json():
        logger.error("Error getting user profile: {}".format(response.text))
        return Response(
            {
                "error": "Encontramos un error obteniendo tu perfil, por favor intenta más tarde."
            },
            status=500,
        )
    return Response(response.json())


@api_view(["PATCH"])
def update_profile(request):
    """Do a request to the StaffNet API to update the user profile."""
    if not request.user.is_authenticated:
        return Response(
            {
                "error": "No tienes permisos para acceder a esta información, por favor inicia sesión."
            },
            status=401,
        )

    if os.environ.get("StaffNetToken") is None:
        if not login_staffnet():
            return Response(
                {
                    "error": "Encontramos un error actualizando tu perfil, por favor intenta después."
                },
                status=500,
            )
    user = request.user
    columns = [
        "estado_civil",
        "hijos",
        "personas_a_cargo",
        "tel_fijo",
        "celular",
        "correo",
        "contacto_emergencia",
        "parentesco",
        "tel_contacto",
    ]

    data = {
        "table": "personal_information",
        "cedula": user.cedula,
    }

    data["value"] = []
    data["column"] = []
    # Get the values from the request
    for value in columns:
        if request.data.get(value) is not None:
            data["value"].append(request.data.get(value))
            data["column"].append(value)

    if not data["value"] or not data["column"]:
        return Response(
            {
                "error": "Alguno de los datos ingresados no es válido, por favor verifica e intenta de nuevo."
            },
            status=400,
        )

    if "correo" in data["column"]:
        try:
            validate_email(data["value"][data["column"].index("correo")])
        except Exception:
            return Response(
                {
                    "error": "El correo ingresado no es válido, por favor verifica e intenta de nuevo."
                },
                status=400,
            )

    if "test" in sys.argv or settings.DEBUG:
        url = "https://staffnet-api-dev.cyc-bpo.com/update"
    else:
        url = "https://staffnet-api.cyc-bpo.com/update"
    # Make the request
    response = requests.patch(
        url,
        json=data,
        cookies={"StaffNet": os.environ["StaffNetToken"]},
    )
    # Check the response
    if response.status_code == 400:
        return Response(
            {
                "error": "No se detectaron cambios en tu perfil, por favor verifica e intenta de nuevo."
            },
            status=400,
        )
    elif response.status_code != 200 or "error" in response.json():
        logger.error("Error updating user profile: {}".format(response.text))
        # delete the token to try to login again
        del os.environ["StaffNetToken"]
        return Response(
            {
                "error": "Encontramos un error actualizando tu perfil, por favor intenta más tarde."
            },
            status=500,
        )
    if "correo" in data["column"]:
        user.email = data["value"][data["column"].index("correo")]
        user.save()
    return Response({"message": "User profile updated"})


@api_view(["GET"])
def get_subordinates(request):
    user_rank = request.user.job_position.rank
    # Get all users that have a lower rank than the current user and are in the same area
    if user_rank >= 4:
        users = User.objects.filter(
            (Q(area=request.user.area) | Q(area__manager=request.user))
            & Q(job_position__rank__lt=user_rank)
            | Q(pk=request.user.pk)
        )
    else:
        users = User.objects.filter(
            Q(area=request.user.area) | Q(area__manager=request.user),
            Q(job_position__rank__lt=user_rank),
        ).order_by("first_name", "last_name", "id")
    # TODO: Refactor this when the migration of StaffNet is done
    # Check if each user is active in StaffNet
    if "test" not in sys.argv and len(users) > 0:
        with connections["staffnet"].cursor() as cursor:
            cursor.execute(
                f"""
                SELECT DISTINCT 
                    `cedula`
                FROM
                    `leave_information`
                WHERE
                    `cedula` IN ({",".join([str(user.cedula) for user in users])})
                    AND `estado` = TRUE
            """
            )
            active_users = cursor.fetchall()
            active_users = [user[0] for user in active_users]
        users = [user for user in users if int(user.cedula) in active_users]
    # Serialize the users
    data = [{"id": user.id, "name": user.get_full_name()} for user in users]
    return Response(data)


@api_view(["POST"])
@permission_required("users.upload_points", raise_exception=True)
def upload_points(request):
    """Upload the user points in the database using a CSV file."""
    if not request.user.has_perm("users.upload_points"):
        return Response(
            {
                "error": "No tienes permisos para realizar esta acción, por favor contacta a un administrador."
            },
            status=403,
        )
    file = request.FILES.get("file")
    if not file:
        return Response(
            {
                "error": "No se ha encontrado el archivo, por favor verifica e intenta de nuevo."
            },
            status=400,
        )
    if not file.name.endswith(".csv"):
        return Response(
            {
                "error": "El archivo debe ser un archivo CSV, por favor verifica e intenta de nuevo."
            },
            status=400,
        )
    # Read the file using csv module
    file_data = file.read().decode("utf-8-sig").splitlines()
    lines = csv.reader(file_data, delimiter=";")
    # Check the header
    header = next(lines)
    if len(header) != 2:
        lines = csv.reader(file_data.splitlines(), delimiter=",")
        header = next(lines)
    if header != ["cedula", "puntos"]:
        return Response(
            {
                "error": "El archivo debe tener dos columnas llamadas 'cedula' y 'puntos', por favor verifica e intenta de nuevo."
            },
            status=400,
        )
    # Update the points
    errors = []
    for line in lines:
        cedula = line[0]
        points = line[1]
        user = User.objects.filter(cedula=cedula).first()
        if user:
            user.points = points
            user.save()
        else:
            errors.append(cedula)
    if errors:
        create_notification(
            "Error actualizando puntos",
            f"Algunos usuarios no fueron encontrados: {', '.join(errors)}",
            request.user,
        )
        return Response(
            {"error": "Algunos usuarios no fueron encontrados", "errors": errors},
            status=400,
        )
    return Response({"message": "User points updated"})


@api_view(["GET"])
def get_points(request):
    """Check the user points in the database."""
    users = User.objects.all().order_by("-points")
    data = [
        {
            "cedula": user.cedula if user.cedula == request.user.cedula else None,
            "area": user.area.name,
            "name": user.get_full_name(),
            "points": user.points,
        }
        for user in users
    ]
    return Response(data)
