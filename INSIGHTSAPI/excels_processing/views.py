"""This module contains the views for the excels_processing app. """
import logging
import os
from users.models import User
from django.contrib.auth.models import Permission
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
import mysql.connector
from .excel_functions import upload_df_to_table, file_to_data_frame


logger = logging.getLogger("requests")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def robinson_list(request):
    """Uploads a file to the server and inserts its data into the database."""

    if not request.user.has_perm("users.upload_robinson_list"):
        return Response(request.user.get_all_permissions(), status=403)
    file = request.FILES["file"]
    data_f = file_to_data_frame(file)
    if not "DETALLE_DATO_CONTACTO" in data_f.columns:
        return Response("Invalid file", status=400)
    filtered_df = data_f[data_f["DETALLE_DATO_CONTACTO"].astype(str).str.len() == 10]
    filtered_df = filtered_df.reindex(data_f.index)
    filtered_df = data_f[
        filtered_df["DETALLE_DATO_CONTACTO"].astype(str).str.startswith("3")
    ]
    columns_mapping = {"DETALLE_DATO_CONTACTO": "numero"}
    db_config = {
        "user": "blacklistuser",
        "password": os.environ["black_list_pass"],
        "host": "172.16.0.9",
        "port": "3306",
        "database": "asteriskdb",
    }
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        rows = upload_df_to_table(filtered_df, connection, "blacklist", columns_mapping)
        if rows > 0:
            return Response(
                {"message": "File processed successfully.", "rows_updated": rows},
                status=201,
            )
        else:
            return Response({"message": "No data was inserted."}, status=200)
    except Exception as error:
        logger.error(error)
        return Response(str(error), status=500)
    finally:
        if connection and connection.is_connected():
            connection.close()
