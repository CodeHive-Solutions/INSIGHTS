"""Generate a template for goals delivery"""
from datetime import datetime
from django.conf import settings
from django.templatetags.static import static


def get_template(
    name: str,
    cedula: int,
    job_title: str,
    campaign: str,
    quantity: float,
    criteria: str,
):
    """Generate a template for goals delivery"""
    today = datetime.now()
    year = today.year
    month = today.month

    if quantity < 10 and isinstance(quantity, float):
        quantity = round(quantity * 100)
        quantity = "{}%".format(str(quantity))
    elif quantity < 1000000:
        pass
    else:
        # quantity = number_format(quantity, 0, ',', '.');
        quantity = "{}$".format(str(quantity))

    header = """<!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <style>
            .header {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
            }

            .footer {
                font-size: 14px;
                text-align: right;
                margin-top: 20px;
            }

            .body {
                font-size: 15px;
                text-align: justify;
            }

            .table-signatures,
            .table-goal {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            .table-signatures td {
                text-align: center;
            }

            .table-goal td,
            .table-goal th {
                text-align: left;
                padding: 8px 0px;
                border-bottom: 1px solid #ddd;
            }
        </style>
    </head>
    """
    body = f"""
    <body class="body">

        <div class="container">
            <div class="text-center">
                <img src="{static("/images/logo_cyc.png")}" alt="Logo_C&C" width="100px">
            </div>
            <div class="header pt-5">
                PLANTILLA DE ENTREGA DE METAS
            </div>
            <p>Bogotá D.C. {today.date} de {month} de {year}</p>
            <p> Señor(a) {name}</p>
            <p>Identificación: {cedula} </p>
            <p>Cargo: {job_title}</p>
            <p>Campaña: {campaign}</p>
            <p><b>Referencia: Notificación de metas del mes {month} año {year}</b></p>
            <p>Cordial saludo,</p>
            <p>Mediante el presente comunicado nos permitimos informarle que, de acuerdo con el objeto de su contrato, la meta esperada para el mes de la referencia es la siguiente:</p>

            <table class="table-goal">
                <tr>
                    <td><b>Descripción de la Variable a medir</b></td>
                    <td style='text-align: center;'><b>Cantidad</b></td>
                </tr>
                <tr>
                    <td>{criteria}</td>
                    <td style='text-align: center;'>
                        {quantity}
                    </td>
                </tr>
            </table>

            <p>Cordialmente,</p>
            <div class="signatures">
                <table class="table-signatures">
                    <tr>
                        <td style="text-align: left;">
                            <img src="./firmas/firma.png" alt="firma" width="150px">
                            <p>___________________</p>
                            <p>Adriana Páez</p>
                            <p>Gerente de Operaciones</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </body>

    </html>"""

    template = header + body
    return template
