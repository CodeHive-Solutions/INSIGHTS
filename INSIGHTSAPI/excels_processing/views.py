"""This module contains the views for the excels_processing app."""

import logging
import os
import re
import shutil
from datetime import datetime
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
        cursor = connection.cursor()
        rows = upload_df_to_table(filtered_df, connection, "blacklist", columns_mapping)
        query = "SELECT COUNT(*) AS row_count FROM blacklist;"
        cursor.execute(query)
        total_rows = cursor.fetchone()[0]
        uploaded_rows = len(data_f)
        if rows > 0:
            return Response(
                {
                    "message": "File processed successfully.",
                    "uploaded_rows": uploaded_rows,
                    "database_rows": total_rows,
                    "updated_rows": rows,
                },
                status=201,
            )
        else:
            return Response(
                {
                    "message": "No data was inserted.",
                    "uploaded_rows": uploaded_rows,
                    "database_rows": total_rows,
                    "updated_rows": rows,
                },
                status=200,
            )
    except Exception as error:
        logger.error(error)
        return Response(status=500)
    finally:
        if connection and connection.is_connected():
            connection.close()


@api_view(["POST"])
def call_transfer_list(request):
    """Change the path of the calls to the another location."""
    if not request.user.has_perm("excels_processing.call_transfer"):
        return Response({"error": "Access denied"}, status=403)
    if not request.POST.get("campaign"):
        return Response({"error": "No campaign found in the request"}, status=400)
    if "file" not in request.FILES:
        return Response({"error": "No file found in the request"}, status=400)
    if "folder" not in request.POST:
        return Response({"error": "No folder found in the request"}, status=400)
    campaign = str(request.POST.get("campaign")).lower()
    if campaign not in [
        "falabella",
        "banco_agrario",
        "test_falabella",
        "test_banco_agrario",
    ]:
        return Response({"error": "Campaña no encontrada."}, status=400)
    # check if the folder exists
    file = request.FILES["file"]
    data_f = file_to_data_frame(file)
    required_columns = ["FECHA", "NUMERO"]
    # Check if the file has the required columns, and say which ones are missing
    missing_columns = [
        column for column in required_columns if column not in data_f.columns
    ]
    logger.info("Missing columns: %s", data_f.columns)
    if missing_columns:
        return Response(
            {"error": f"Missing columns: {', '.join(missing_columns)}"}, status=400
        )
    # Transfer the calls files to the new path
    paths = {
        "falabella_old": "/var/servers/falabella/BOGOTA/LLAMADAS_PREDICTIVO/",
        "falabella_new": "/var/servers/calidad/Llamadas Banco Falabella/",
        "banco_agrario_old": "/var/servers/banco_agrario/LLAMADAS_PREDICTIVO/",
        "banco_agrario_new": "/var/servers/calidad/Llamadas Banco Agrario/",
        "test_banco_agrario_old": "/var/servers/banco_agrario/test/test/",
        "test_banco_agrario_new": "/var/servers/calidad/test/test/",
        "test_falabella_old": "/var/servers/falabella/test/test/",
        "test_falabella_new": "/var/servers/calidad/test/test/",
    }

    path_old = os.path.join(
        paths[f"{campaign}_old"], "{date:%Y/%m/%d/}", request.POST.get("folder")
    )
    path_new = os.path.join(paths[f"{campaign}_new"], "{entry.name}")
    fails = []

    for row in data_f.itertuples(index=False):
        # Break the loop if the date is empty or nan
        if not row.FECHA or row.FECHA != row.FECHA:
            continue

        date = datetime.strptime(str(row.FECHA).split(" ", maxsplit=1)[0], "%d/%m/%Y")
        try:
            number = int(row.NUMERO)  # type: ignore
        except ValueError:
            fails.append(row.NUMERO)
            continue
        match = None
        if "banco_agrario" in campaign:
            pattern = re.compile(rf"{number}_")
        elif "falabella" in campaign:
            pattern = re.compile(rf"_{number}-")
        else:
            return Response({"error": "Invalid campaign"}, status=400)

        search_path = os.path.normpath(path_old.format(date=date))
        if not search_path.startswith(paths[f"{campaign}_old"]):
            return Response({"error": "Invalid folder path"}, status=400)
        if not os.path.exists(search_path):
            return Response(
                {"error": f"Folder for date {date.strftime('%d/%m/%Y')} does not exist."},
                status=400
            )
        for entry in os.scandir(search_path):
            if entry.name.endswith(".mp3") and pattern.search(entry.name):
                retries = 0
                while retries < 3:
                    try:
                        final_path = path_new.format(entry=entry)
                        # Transfer the file
                        print(f"Copying {entry.path} to {final_path}")
                        with open(entry.path, 'rb') as src, open(final_path, 'wb') as dest:
                            shutil.copyfileobj(src, dest)
                        match = True
                        print(f"File {entry.name} transferred successfully.")
                        break
                    except Exception as error:
                        logger.critical(error)
                        retries += 1
                if retries == 3:
                    return Response(
                        {"error": "Error transferring the file"}, status=500
                    )
        if match is not True:
            fails.append(number)
    return Response({"message": "Files transferred successfully.", "fails": fails})
