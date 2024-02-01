"""This module contains the command to update the events from the external DB."""
import os
from django.core.management.base import BaseCommand
from operational_risk.models import Events, EventClass, Level, Process
from sgc.models import SGCFile, SGCArea
from django.core.files.base import ContentFile
from rest_framework.response import Response
import mysql.connector


class Command(BaseCommand):
    """Class to update the events from the external DB"""

    help = "Update the events from the external DB"

    def handle(self, *args, **options):
        """Method to handle the command"""
        try:
            connection = mysql.connector.connect(
                host="172.16.0.6",
                user="root",
                password=os.environ["LEYES"],
                database="userscyc",
            )
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM userscyc.ero_claseevento")
            event_class = cursor.fetchall()
            cursor.execute("SELECT * FROM userscyc.ero_perdidas")
            lost_type = cursor.fetchall()
            cursor.execute("SELECT * FROM userscyc.ero_procesos")
            process = cursor.fetchall()
            cursor.execute("SELECT * FROM userscyc.ero_productos")
            product_line = cursor.fetchall()
            cursor.execute("SELECT * FROM userscyc.eventos")
            events = cursor.fetchall()
            cursor.close()
            for event_class_row in event_class:
                EventClass.objects.get_or_create(
                    id=event_class_row["id"], name=event_class_row["nombre"]
                )
            for lost_type_row in lost_type:
                
            connection.close()
            sgc_files_to_create = []
            types_dict = {
                1: "P",
                2: "PR",
                3: "PL",
                4: "RG",
                8: "MA",
                9: "IN",
                11: "CR",
            }
            for row in rows:
                fixed_text = fix_text(row["name"])
                slugged_text = slugify(fixed_text)
                # fixed_text = row["name"]
                row["type"] = types_dict.get(row["type"])
                if row["tipo_documento"] == 2:
                    name = slugged_text + ".xlsx"
                elif row["tipo_documento"] == 1:
                    name = slugged_text + ".pdf"
                else:
                    name = slugged_text
                content_file = ContentFile(row["file"], name=name)
                SGCFile.objects.create(
                    name=fixed_text,
                    area=SGCArea.objects.get(id=row["area"]),
                    type=row["type"],
                    sub_type=row["sub_type"],
                    version=row["version"],
                    file=content_file,
                )
                # sgc_files_to_create.append(file)
            # SGCFile.objects.bulk_create(sgc_files_to_create)
            return Response({"message": "Archivos creados"})
        except Exception as e:
            logger.critical(e, exc_info=True)
            return Response({"error": str(e)}, status=500)
