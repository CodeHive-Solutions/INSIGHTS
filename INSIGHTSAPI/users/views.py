import logging
import requests
from rest_framework.decorators import api_view
from rest_framework.decorators import login_required
from rest_framework.response import Response

logger = logging.getLogger("requests")


@api_view(["PATCH"])
@login_required
def update_profile(request):
    """Do a request to the StaffNet API to update the user profile."""
    if (
        request.data.get("cedula") is None
        or request.data.get("cedula") is not request.user.cedula
    ):
        return Response(
            {"error": "No tienes permiso para realizar esta acción"}, status=403
        )
    user = request.user
    # Get the user data
    data = {
        "table": "personal_information",
        "cedula": user.cedula,
        "value": [
            request.get("name"),
            request.get("last_name"),
            request.get("gender"),
            request.get("civil_status"),
            request.get("children"),
            request.get("dependents"),
            request.get("stratum"),
            request.get("phone"),
            request.get("cellphone"),
            request.get("email"),
            request.get("emergency_contact"),
            request.get("relationship"),
            request.get("emergency_phone"),
        ],
        "column": [
            "nombres",
            "apellidos",
            "genero",
            "estado_civil",
            "hijos",
            "personas_a_cargo",
            "estrato",
            "tel_fijo",
            "celular",
            "correo",
            "contacto_emergencia",
            "parentesco",
            "tel_contacto",
        ],
    }
    # Remove the None values
    data = {key: value for key, value in data.items() if value is not None}
    # Make the request
    response = requests.patch(
        "https://staffnet.com/api/v1/users/{}/".format(user.id),
        data=data,
        headers={"Authorization ": "Bearer {}".format(user.auth_token)},
    )
    # Check the response
    if response.status_code != 200:
        logger.error("Error updating user profile: {}".format(response.text))
        return Response({"error": "Error updating user profile"}, status=500)


# @api_view(['GET'])
# @login_required
# def get_users(request):
#     user_rank = request.user.job_position.rank
#     if user_rank >= 6:
#         # Get all users that have a lower rank than the current user
#         users = User.objects.filter(job_position__rank__lt=user_rank)
#     else:
#         # Get all users that have a lower rank than the current user and are in the same area
#         users = User.objects.filter(job_position__rank__lt=user_rank, area=request.user.area)
#     # Serialize the users
#     data = [{'id': user.id, 'name': user.get_full_name()} for user in users]
#     return Response(data)
