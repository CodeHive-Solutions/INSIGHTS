import logging
from simple_history.models import HistoricalRecords
import os
from django.utils import timezone
import ssl
import ftfy
from smtplib import SMTP
import base64
import mysql.connector
from django.conf import settings
from django.core.mail import EmailMessage
from openpyxl import load_workbook
from rest_framework import viewsets, status as framework_status
from rest_framework.decorators import action
from rest_framework.response import Response
# from .models import Goals, TableInfo
# from .serializers import GoalSerializer

class EmailSender(viewsets.ModelViewSet):
    def send_email(self, request, *args, **kwargs):
        pdf_64 = request.POST.get('pdf')
        cedula = request.POST.get('cedula')
        delivery_type = request.POST.get('delivery_type')
        db_connection = None
        if pdf_64 and cedula and delivery_type:
            try:
                intranet_config = {
                    'host': '172.16.0.6',
                    'user': 'root',
                    'password': os.getenv('LEYES'),
                    'database': 'userscyc',
                    'port': '3306',
                }
                intranet_db = mysql.connector.connect(**intranet_config)
                db_cursor = intranet_db.cursor()
                instance = Goals.objects.filter(cedula=cedula).first()
                db_cursor.execute("SELECT email_user, pnom_user, pape_user FROM users WHERE `id_user` = %s",[cedula])
                result = db_cursor.fetchone()
                if result is not None and instance is not None:
                    try:
                        correo = result[0]
                        nombre = str(result[1]) + ' ' + str(result[2])
                        nombre_encoded = ftfy.fix_text(nombre)
                        decoded_pdf_data = base64.b64decode(pdf_64)
                        email = EmailMessage(
                            f'{delivery_type}',
                                    '<html><body>'
                                    '<div>'
                                    f'<p>Estimado/a {nombre_encoded.title()}:</p>'
                                    f'<p>Se ha procesado su {delivery_type}.<br> Por favor, no responda ni reenvíe este correo. Contiene información confidencial.<br>'
                                    '<div style="color: black;">Cordialmente,<br>'
                                    'M.I.S. Management Information System C&C Services</div></p>'
                                    '</div>'
                                    '</body></html>',
                            f'{delivery_type} <{settings.DEFAULT_FROM_EMAIL}>',
                            [str(correo)],
                        )
                        email.content_subtype = "html"
                        email.attach(f'{delivery_type}.pdf', decoded_pdf_data, "application/pdf")
                        # Get the underlying EmailMessage object
                        email_msg = email.message()
                        # Create an SMTP connection
                        connection = SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
                        connection.ehlo()
                        # Wrap the socket with the SSL context
                        context = ssl.create_default_context()
                        context.check_hostname = False
                        context.verify_mode = ssl.CERT_NONE
                        connection.starttls(context=context)
                        # Authenticate with the SMTP server
                        connection.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                        # Send the email
                        connection.send_message(email_msg)
                        # Close the connection
                        connection.quit()
                        if delivery_type == "Ejecución de metas":
                            instance.accepted_execution_at = timezone.now()
                            instance.accepted_execution = True
                            instance.save()
                        else:
                            instance.accepted_at = timezone.now()
                            instance.accepted = True
                            instance.save()
                        print("Email sent successfully")
                        return Response({'email': correo}, status=framework_status.HTTP_200_OK) 
                    except Exception as e:
                        logger.setLevel(logging.ERROR)
                        logger.exception("Error: %s", str(e))
                        print("Error: %s", str(e))
                        return Response(status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({'Error': "Email not found"}, status=framework_status.HTTP_404_NOT_FOUND)
            except Exception as e:
                logger.setLevel(logging.ERROR)
                logger.exception("Error: %s", str(e))
                print("Error: %s", str(e))
                return Response(status=framework_status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if db_connection is not None and db_connection.is_connected():
                    db_connection.close()   
        else:
            return Response({'Error': f'{"PDF" if not pdf_64 else "Cedula"} not found in the request.'}, status=framework_status.HTTP_400_BAD_REQUEST)