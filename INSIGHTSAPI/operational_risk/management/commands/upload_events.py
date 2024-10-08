import logging
import os

import pandas as pd
from django.core.management.base import BaseCommand
from ftfy import fix_text

from operational_risk.models import (
    EventClass,
    Events,
    Level,
    LostType,
    Process,
    ProductLine,
)

logger = logging.getLogger("requests")


class Command(BaseCommand):
    """Class to update the events from an Excel file"""

    help = "Update the events from an Excel file"

    def handle(self, *args, **options):
        """Method to handle the command"""

        # Load Excel file (update path as needed)
        file_path = os.path.join(os.getcwd(), "Eventos 2023.xlsx")

        # Read each sheet into a pandas DataFrame
        df = pd.read_excel(file_path, sheet_name=None)

        # Iterate over each row
        for event_row in df["Hoja1"].to_dict(orient="records"):
            # Fix text only for string values, skip others
            event_row = {
                k: fix_text(v) if isinstance(v, str) else v
                for k, v in event_row.items()
            }

            event_class = EventClass.objects.get(name=event_row["Clase de Evento"])
            level = None
            nivel = event_row["Nivel"].upper()
            if nivel == "BAJO":
                level, _ = Level.objects.get_or_create(name="BAJO")
            elif nivel == "MEDIO":
                level, _ = Level.objects.get_or_create(name="MEDIO")
            elif nivel == "ALTO":
                level, _ = Level.objects.get_or_create(name="ALTO")

            process = Process.objects.get(name=event_row["Proceso"])
            product = ProductLine.objects.get(name=event_row["Producto"])

            dates = [
                "Fecha de Inicio",
                "Fecha de Fin",
                "Fecha de Descubrimiento",
                "Fecha de Atención",
                "Fecha de Cierre",
            ]
            for date in dates:
                if event_row[date] == "0000-00-00":
                    event_row[date] = None
                else:
                    event_row[date] = pd.to_datetime(event_row[date], dayfirst=True)

            event_row["critico"] = bool(event_row["Clasificación"] == "CRITICO")
            event_row["estado"] = event_row["Estado Actual"] != "CERRADO"

            Events.objects.create(
                start_date=event_row["Fecha de Inicio"],
                end_date=event_row["Fecha de Fin"],
                discovery_date=event_row["Fecha de Descubrimiento"],
                accounting_date=event_row["Fecha de Atención"],
                currency=event_row["Divisa"],
                quantity=event_row["Cuantía"],
                recovered_quantity=event_row["Cuantía Total Recuperada"],
                recovered_quantity_by_insurance=event_row["Cuantía Rec. x Seguros"],
                event_class=event_class,
                reported_by=event_row["Reportado Por"],
                critical=event_row["critico"],
                level=level,
                plan=event_row["Plan"],
                event_title=event_row["Evento"],
                public_accounts_affected=event_row["Cuentas PUC Afectadas"],
                process=process,
                lost_type=LostType.objects.get(name=event_row["Tipo de Perdida"]),
                description=event_row["Descripción del Evento"],
                product=product,
                close_date=event_row["Fecha de Cierre"],
                learning=event_row["Aprendizaje"],
                status=event_row["estado"],
            )
            print(f"Event {event_row['Evento']} updated")

        self.stdout.write(self.style.SUCCESS("Events updated"))
