from random import choices
from django.db import models


class events(models.Model):
    """Model definition for operational events."""

    start_date = models.DateField()
    end_date = models.DateField()
    discovery_date = models.DateField()
    accounting_date = models.DateField()
    currency = models.CharField(max_length=100, choices={"USD", "COP"})
    quantity = models.IntegerField()
    recovered_quantity = models.IntegerField()
    recovered_quantity_by_insurance = models.IntegerField()
    event_class = models.CharField(
        max_length=100,
        choices={
            "FRAUDE INTERNO",
            "FRAUDE EXTERNO",
            "RELACIONES LABORALES",
            "CLIENTES",
            "DAÑOS ACTIVOS FÍSICOS",
            "FALLAS TECNOLÓGICAS",
            "EJECUCIÓN Y ADMINISTRACIÓN DE PROCESOS",
            "AGENTES EXTERNOS",
        },
    )
    reported_by = models.CharField(max_length=100)
    classification = models.CharField(max_length=100, choices={"CRITICO", "NO CRITICO"})
    level = models.CharField(max_length=100, choices={"ALTO", "MEDIO", "BAJO"})
    plan = models.CharField(max_length=100)
    event = models.CharField(max_length=100)
    public_accounts_affected = models.CharField(max_length=100)
    process = models.CharField(
        max_length=100,
        choices={
            "AVANTEL",
            "AZTECA",
            "BANCO AGRARIO",
            "BAYPORT",
            "CLARO",
            "CLARO VENTAS",
            "CONGENTE",
            "COOMEVA",
            "FALABELLA",
            "GERENCIA ADMINISTRATIVA",
            "LEGAL Y RIESGO",
            "METLIFE",
            "NUEVA EPS",
            "PAYU",
            "QUALITY",
            "RECURSOS FISICOS",
            "RRHH",
            "SCOTIABANK COLPATRIA",
            "TECNOLOGIA",
            "TODOS",
            "YANBAL",
        },
    )
    lost_type = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    product_line = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    date_of_closure = models.DateField()
    learning = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = "events"
