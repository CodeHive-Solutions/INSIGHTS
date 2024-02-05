"""This module contains the command to update the events from the external DB."""
import os
import logging
from operational_risk.models import Events, EventClass, Level, Process, LostType, ProductLine
from sgc.models import SGCFile, SGCArea
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from rest_framework.response import Response
from ftfy import fix_text
import mysql.connector



logger = logging.getLogger("requests")


class Command(BaseCommand):
    """Class to update the events from the external DB"""

    help = "Update the events from the external DB"

    def handle(self, *args, **options):
        """Method to handle the command"""
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
        product = cursor.fetchall()
        cursor.execute("SELECT * FROM userscyc.ero_eventos")
        events = cursor.fetchall()
        cursor.close()

        for event_class_row in event_class:
            EventClass.objects.get_or_create(
                pk=event_class_row["id"], name=fix_text(event_class_row["claseevento"])
            )
        for lost_type_row in lost_type:
            LostType.objects.get_or_create(
                pk=lost_type_row["id"], name=fix_text(lost_type_row["perdida"])
            )
        for process_row in process:
            Process.objects.get_or_create(
                pk=process_row["id"], name=fix_text(process_row["proceso"])
            )
        for product_row in product:
            ProductLine.objects.get_or_create(
                pk=product_row["id"], name=fix_text(product_row["producto"])
            )
        for event_row in events:
            # Fix the values of the dictionary
            for key, value in event_row.items():
                if isinstance(value, str):
                    event_row[key] = fix_text(value)
                elif isinstance(value, int):
                    pass
            event_class = EventClass.objects.get(id=event_row["clase_evento"])
            level = None
            if event_row["nivel"] == "BAJO":
                level, _ = Level.objects.get_or_create(name="BAJO")
            elif event_row["nivel"] == "MEDIO":
                level, _ = Level.objects.get_or_create(name="MEDIO")
            elif event_row["nivel"] == "ALTO":
                level, _ = Level.objects.get_or_create(name="ALTO")
            process = Process.objects.get(id=event_row["proceso"])
            product = ProductLine.objects.get(id=event_row["linea_producto"])
            dates = [
                "fechainicio_evento",
                "fechafin_evento",
                "fechahora_descubrimiento",
                "fecha_contabilizacion",
                "fechacierre_incidencia"
            ]
            for date in dates:
                if event_row[date] == "0000-00-00":
                    event_row[date] = None
            if event_row["clasificacion"] == "CRITICO":
                event_row["critico"] = True
            else:
                event_row["critico"] = False
            if event_row["estadoactual_incidencia"] == "CERRADO":
                event_row["estado"] = False
            else:
                event_row["estado"] = True
            print(event_row["id"])
            Events.objects.get_or_create(
                pk=event_row["id"],
                start_date=event_row["fechainicio_evento"],
                end_date=event_row["fechafin_evento"],
                discovery_date=event_row["fechahora_descubrimiento"],
                accounting_date=event_row["fecha_contabilizacion"],
                currency=event_row["divisa"],
                quantity=event_row["cuantia"],
                recovered_quantity=event_row["cuantiatotal_recuperada"],
                recovered_quantity_by_insurance=event_row["cuantiarecuperada_seguros"],
                event_class=event_class,
                reported_by=event_row["reportado"],
                critical=event_row["critico"],
                level=level,
                plan=event_row["plan"],
                event_title=event_row["evento"],
                public_accounts_affected=event_row["cuentaspuc_afectadas"],
                process=process,
                lost_type=LostType.objects.get(id=event_row["tipoperdida"]),
                description=event_row["descripcion_evento"],
                product=product,
                date_of_closure=event_row["fechacierre_incidencia"],
                learning=event_row["aprendizaje"],
                status=event_row["estado"],
            )
        connection.close()
        self.stdout.write(self.style.SUCCESS("Events updated"))
