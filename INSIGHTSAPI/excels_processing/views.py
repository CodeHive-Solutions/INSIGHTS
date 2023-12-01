"""This module contains the views for the excels_processing app."""
import logging
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
import shutil
import re
import os
from datetime import datetime
import mysql.connector
from .excel_functions import upload_df_to_table, file_to_data_frame


logger = logging.getLogger("requests")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def robinson_list(request):
    """Uploads a file to the server and inserts its data into the database."""
    if not request.user.has_perm("users.upload_robinson_list"):
        return Response(request.user.get_all_permissions(), status=403)
    if not "file" in request.FILES:
        return Response("No file found in the request", status=400)
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
        total_rows = len(data_f)
        if rows > 0:
            return Response(
                {
                    "message": "File processed successfully.",
                    "total_rows": total_rows,
                    "rows_updated": rows,
                },
                status=201,
            )
        else:
            return Response(
                {"message": "No data was inserted.", "total_rows": total_rows},
                status=200,
            )
    except Exception as error:
        logger.error(error)
        return Response(str(error), status=500)
    finally:
        if connection and connection.is_connected():
            connection.close()


@api_view(["POST"])
def call_transfer_list(request):
    """Change the path of the calls to the another location."""
    if not request.user.has_perm("excels_processing.call_transfer"):
        return Response("Access denied", status=403)
    if not request.POST.get("campaign"):
        return Response("No campaign found in the request", status=400)
    if not "file" in request.FILES:
        return Response("No file found in the request", status=400)
    campaign = str(request.POST.get("campaign")).lower()
    paths = {
        "falabella_old": "/var/servers/falabella/BOGOTA/LLAMADAS_PREDICTIVO/",
        "falabella_new": "/var/servers/calidad/",
    }
    # check if the folder exists
    file = request.FILES["file"]
    data_f = file_to_data_frame(file)
    required_columns = ["FECHA", "CELULAR"]
    # Check if the file has the required columns, and say which ones are missing
    missing_columns = [
        column for column in required_columns if column not in data_f.columns
    ]
    if missing_columns:
        return Response(f"Missing columns: {', '.join(missing_columns)}", status=400)
    # Transfer the calls files to the new path
    pattern = re.compile(r"_(\d+)-")
    for row in data_f.itertuples(index=False):
        date = datetime.strptime(str(row.FECHA.date()), "%Y-%m-%d")
        number = str(row.CELULAR)
        match = None
        for entry in os.scandir(
            paths[f"{campaign}_old"] + f"{date.year}/{date.month}/{date.day}/OUT/"
        ):
            if entry.is_file() and entry.name.endswith(".mp3"):
                # Use the compiled pattern to match the middle number
                match = pattern.search(entry.name)
                if match and match.group(1) == number:
                    # Transfer the file
                    shutil.copy2(
                        entry.path,
                        paths[f"{campaign}_new"] + entry.name,
                    )
                    match = True
                    break
        if match is True:
            logger.warning(f"No file found for {number} on {date}")
    return Response("Files transferred successfully", status=200)
