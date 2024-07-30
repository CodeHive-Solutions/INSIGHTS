import os
import logging
import requests
import sys
from rest_framework.decorators import api_view
from django.conf import settings
from django.core.mail import mail_admins
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
    if response.status_code != 200 or "StaffNet" not in response.cookies:
        logger.error("Error logging in StaffNet: {}".format(response.text))
        mail_admins(
            "Error logging in StaffNet",
            "Error logging in StaffNet: {}".format(response.text),
        )
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
        logger.error("Error getting user profile: {}".format(response.text))
        # delete the token to try to login again
        del os.environ["StaffNetToken"]
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
                    "error": "Encontramos un error actualizando tu perfil, por favor intenta más tarde."
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
        print(user)
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
    if user_rank >= 6:
        # Get all users that have a lower rank than the current user
        users = User.objects.filter(job_position__rank__lt=user_rank)
    else:
        # Get all users that have a lower rank than the current user and are in the same area
        users = User.objects.filter(
            job_position__rank__lt=user_rank, area=request.user.area
        )
    # Serialize the users
    data = [{"id": user.id, "name": user.get_full_name()} for user in users]
    return Response(data)
