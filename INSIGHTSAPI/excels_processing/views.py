"""This module contains the views for the excels_processing app. """
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
import mysql.connector
from .excel_functions import upload_df_to_table, file_to_data_frame

logger = logging.getLogger(__name__)

@api_view(['POST'])
def robinson_list(request):
    """Uploads a file to the server and inserts its data into the database."""
    file = request.FILES['file']
    data_f = file_to_data_frame(file)
    if not 'DETALLE_DATO_CONTACTO' in data_f.columns:
        return Response("Invalid file", status=400)
    filtered_df = data_f['DETALLE_DATO_CONTACTO'].astype(str).str.len() == 10
    filtered_df = data_f[filtered_df]
    columns_mapping = {"DETALLE_DATO_CONTACTO": "numero"}
    db_config = {
        'user': 'blacklistuser',
        'password': 'a4dnAGc-',
        'host': '172.16.0.9',
        'port': '3306',
        'database': 'asteriskdb',
    }
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        upload_df_to_table(filtered_df, connection, "blacklist", columns_mapping)
        return Response("File uploaded successfully")
    except Exception as error:
        logger.error(error)
        return Response(error, status=500)
    finally:
        if connection and connection.is_connected():
            connection.close()
