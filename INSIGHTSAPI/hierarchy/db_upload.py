import django

django.setup()

from django.db import connections
from hierarchy.models import JobPosition
from users.models import User


positions = [
    ("PRESIDENTE", "8"),
    ("GERENTE GENERAL", "7"),
    ("GERENTE DE OPERACIONES", "6"),
    ("GERENTE DE PLANEACION", "6"),
    ("GERENTE COMERCIAL Y DE LICITACIONES", "6"),
    ("GERENTE DE RIESGO Y CONTROL INTERNO", "6"),
    ("GERENTE DE CONTROL INTERNO", "6"),
    ("GERENTE DE LEGAL Y DE RIESGO", "6"),
    ("GERENTE DE CUENTAS", "6"),
    ("GERENTE DE GESTION HUMANA", "6"),
    ("GERENTE DE MERCADEO", "6"),
    ("GERENTE DE CALIDAD", "6"),
    ("GERENTE DE TECNOLOGIA", "6"),
    ("GERENTE ADMINISTRATIVA", "6"),
    ("GERENTE JR INFRAESTRUCTURA Y REDES", "5"),
    ("GERENTE JR. DE APLICACIONES DE CONTACT CENTER", "5"),
    ("GERENTE JR. DE MESA DE SERVICIO", "5"),
    ("GERENTE DE CUENTAS JR", "5"),
    ("DIRECTOR(A) DE DESARROLLO", "4"),
    ("DIRECTOR(A) DE CALIDAD", "4"),
    ("DIRECTOR(A) DE PROYECTO", "4"),
    ("DIRECTOR(A) DE INVESTIGACIONES", "4"),
    (
        "DIRECTOR(A) DE SEGURIDAD Y SALUD EN EL TRABAJO, GESTION AMBIENTAL Y BIENESTAR INTEGRAL",
        "4",
    ),
    ("DIRECTOR(A) DE NOMINA Y ADMINISTRACION DE PERSONAL", "4"),
    ("DIRECTOR(A) DE CONTROL INTERNO", "4"),
    ("DIRECTOR(A) JURIDICO", "4"),
    ("DIRECTOR(A) DE LICITACIONES", "4"),
    ("DIRECTOR(A) DE RECURSOS FISICOS", "4"),
    ("JEFE OPERACIONES OPERATIVO", "4"),
    ("COORDINADOR(A) DE PROYECTO", "3"),
    ("COORDINADOR DE COMUNICACIONES", "3"),
    ("COORDINADOR(A) DE FORMACION Y DESARROLLO DEL TALENTO", "3"),
    ("COORDINADOR(A) DE PLANEACION Y CALIDAD", "3"),
    ("COORDINADOR(A) BI", "3"),
    ("COORDINADOR CONTABLE", "3"),
    ("JEFE OPERACIONES PROCESOS", "3"),
    ("JEFE OPERACIONES JURIDICO", "3"),
    ("AUXILIAR OPERATIVO", "2"),
    ("DATA MARSHALL", "2"),
    ("FORMADOR", "2"),
    ("BACK OFFICE", "2"),
    ("ABOGADO(A) JUNIOR", "2"),
    ("AGENTE PROFESIONAL ABOGADO", "2"),
    ("TEAM LIDER", "2"),
    ("ANALISTA DE APLICACIONES DE CONTACT CENTER", "1"),
    ("ANALISTA DE SOPORTE", "1"),
    ("ANALISTA DE INFRAESTRUCTURA Y REDES", "1"),
    ("ANALISTA DE BD Y APLICACIONES", "1"),
    ("ANALISTA DE CALIDAD", "1"),
    ("ANALISTA DE SEGURIDAD Y SALUD EN EL TRABAJO Y MEDIO AMBIENTE", "1"),
    ("ANALISTA JURIDICO", "1"),
    ("ANALISTA DE INVESTIGACION", "1"),
    ("ANALISTA GESTION HUMANA", "1"),
    ("ANALISTA BI", "1"),
    ("ASESOR(A) COMERCIAL", "1"),
    ("ASESOR(A) DE SERVICIO AL CLIENTE", "1"),
    ("ASESOR(A) SENIOR", "1"),
    ("ASESOR(A) DE NEGOCIACION", "1"),
    ("INVESTIGADOR(A) DE CAMPO", "1"),
    ("GESTOR DE COBRANZA MOVIL Y EN SITIO", "1"),
    ("OPERADOR LOGISTICO", "1"),
    ("ASESOR(A) DE NEGOCIACION JR", "1"),
    ("AGENTE PROFESIONAL MINERO DE DATOS", "1"),
    ("AGENTE VIDEOLLAMADA Y LENGUAJE DE SEÑAS", "1"),
    ("AGENTE PROFESIONAL PSICOLOGA", "1"),
    ("AGENTE BILINGÜE TECNICO", "1"),
    ("AGENTE TECNICO", "1"),
    ("AUXILIAR ADMINISTRATIVO", "1"),
    ("AUXILIAR DE LICITACION", "1"),
    ("AUXILIAR CONTABLE", "1"),
    ("AUXILIAR DE CONTROL DE ACCESOS", "1"),
    ("AUXILIAR DE MANTENIMIENTO", "1"),
    ("SENA PRODUCTIVA", "1"),
    ("SENA LECTIVA", "1"),
    ("SERVICIOS GENERALES", "1"),
    ("SUPERVISOR(A) DE CALIDAD", "1"),
]

for name, rank in positions:
    JobPosition.objects.get_or_create(name=name, rank=rank)

with connections["staffnet"].cursor() as cursor:
    cursor.execute("SELECT cargo, cedula FROM employment_information")
    for cargo, cedula in cursor.fetchall():
        try:
            user = User.objects.get(cedula=cedula)
            user.job_title = cargo
            user.save()
        except User.DoesNotExist:
            print(f"User with cedula {cedula} not found")
            continue