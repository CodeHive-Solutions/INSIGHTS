import sys
import ssl
import logging
from email.utils import formataddr
from smtplib import SMTP
from imaplib import IMAP4_SSL
from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend
from django.core.mail import EmailMultiAlternatives


logger = logging.getLogger("requests")


class CustomEmailBackend(EmailBackend):
    """Custom Email Backend for Django using our own SMTP server"""

    display_name = "INTRANET C&C"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.outbox = []

    def add_signature(self, message):
        """Add a signature to the email body depending on the content subtype, and add html alternatives if needed"""
        html_signature = """
        <table style="width: 100%; border-top: 1px solid #ccc; margin-top: 20px;">
            <tr id="contact-info">
                <td style="padding: 10px; width: 35%;">
                    <a href="https://cyc-bpo.com/">
                    <img src="https://raw.githubusercontent.com/CodeHive-Solutions/INSIGHTS/a79b9187f5eb34bf1e41111c9f957ed4f75842ba/INSIGHTSAPI/static/images/Logo_cyc_text.png" width="100%" alt="C&C SERVICES S.A.S">
                    </a>
                </td>
                <td style="padding: 20px;">
                    <strong>C&C SERVICES S.A.S</strong> <br>
                    https://cyc-bpo.com/ <br>
                    PBX: (601)7461166-Ext: 8081 <br>
                    Calle 19 #3-16 | Piso 3-CC Barichara <br>
                    Bogotá D.C.-Colombia
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 10px; font-size: 12px;">
                    <strong>Aviso de confidencialidad:</strong><br>
                    Este correo electrónico y cualquier archivo adjunto son confidenciales y pueden contener información privilegiada. Si usted no es el destinatario correcto, por favor notifique al remitente respondiendo este mensaje y elimine inmediatamente este correo electrónico y cualquier archivo adjunto de su sistema. Si está usted recibiendo este correo electrónico por error, no debe copiar este mensaje o divulgar su contenido a ninguna persona.
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 10px; font-size: 12px;">
                    Mensaje generado automáticamente, por favor no responder.
                </td>
            </tr>
        </table>
        """

        plain_signature = """
        ---
        C&C SERVICES S.A.S
        https://cyc-bpo.com/
        PBX: (601)7461166-Ext: 8081
        Calle 19 #3-16 | Piso 3-CC Barichara
        Bogotá D.C.-Colombia
    
        Aviso de confidencialidad:
        Este correo electrónico y cualquier archivo adjunto son confidenciales y pueden contener información privilegiada. Si usted no es el destinatario correcto, por favor notifique al remitente respondiendo este mensaje y elimine inmediatamente este correo electrónico y cualquier archivo adjunto de su sistema. Si está usted recibiendo este correo electrónico por error, no debe copiar este mensaje o divulgar su contenido a ninguna persona.
    
        Mensaje generado automáticamente, por favor no responder.
        """

        if isinstance(message, EmailMultiAlternatives):
            # Ensure HTML signature is added to the HTML alternative part
            has_html_alternative = False
            for i, (content, mime_type) in enumerate(message.alternatives):
                if mime_type == "text/html":
                    message.alternatives[i] = (content + html_signature, mime_type)
                    has_html_alternative = True
            if not has_html_alternative:
                message.alternatives.append(
                    (message.body.replace("\n", "<br>") + html_signature, "text/html")
                )
        else:
            # If no alternatives, ensure a plain text alternative is added
            if message.content_subtype == "html":
                message.alternatives = [
                    (message.body.replace("\n", "<br>") + html_signature, "text/html")
                ]
            else:
                message.alternatives = [
                    (message.body.replace("\n", "<br>") + html_signature, "text/html"),
                    (message.body, "text/plain"),
                ]

        # Add the appropriate signature based on content_subtype
        if message.content_subtype == "html":
            message.body += html_signature
        else:
            message.body += plain_signature

        # Ensure the message body is plain text if alternatives exist
        if message.content_subtype == "html" and isinstance(
            message, EmailMultiAlternatives
        ):
            message.body = (
                message.body.replace(html_signature, "").strip() + plain_signature
            )

    def open(self):
        if self.connection:
            return False

        try:
            self.connection = SMTP(self.host, self.port)
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            self.connection.starttls(context=context)
            self.connection.login(self.username, self.password)
            return True
        except Exception as e:
            if not self.fail_silently:
                raise e

    # Override the send_messages method without changing its functionality
    def send_messages(self, email_messages):
        if not email_messages:
            return

        with self._lock:
            new_conn_created = self.open()
            if not self.connection:
                # We failed silently on open(). Trying to send would be pointless.
                return

            num_sent = 0
            for message in email_messages:
                if ("test" in sys.argv or settings.DEBUG) and not (
                    all(
                        "heibert.mogollon@cyc-bpo.com" in str(email).lower()
                        or "carreno" in str(email).lower()
                        or "diego.martinez.p@cyc-bpo.com" in str(email).lower()
                        for email in message.to
                    )
                ):
                    raise Exception(f"Email {message.to} not allowed in test mode")
                self.add_signature(message)

                message.from_email = formataddr((self.display_name, self.username))
                sent = self._send(message)
                if sent:
                    num_sent += 1
                    self.outbox.append(message)
                    self.save_to_sent_folder(message)
                else:
                    print("Email not sent")

            if new_conn_created:
                self.close()

        return num_sent

    def save_to_sent_folder(self, email_msg):
        """Save a copy of the email to the 'sent' folder"""
        with IMAP4_SSL(settings.EMAIL_HOST) as imap_connection:
            imap_connection.login(self.username, self.password)
            imap_connection.select('"sent"', readonly=False)

            # Save a copy of the email to the 'sent' folder
            result, _ = imap_connection.append(
                '"sent"', None, None, email_msg.message().as_bytes()  # type: ignore
            )
            if result != "OK":
                logger.exception("Error saving email to 'sent' folder: %s", result)
                # You might want to handle this error more gracefully
                raise Exception("Error saving email to 'sent' folder")

    def close(self):
        try:
            if self.connection is not None:
                self.connection.quit()
        except Exception:
            if not self.fail_silently:
                raise
        finally:
            self.connection = None
