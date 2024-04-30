"""Custom Email Backend for Django using our own SMTP server"""
import sys
import ssl
import logging
from smtplib import SMTP
from imaplib import IMAP4_SSL
from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend


logger = logging.getLogger("requests")


class CustomEmailBackend(EmailBackend):
    """Custom Email Backend for Django using our own SMTP server"""
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

    # Override the send_messages method without changing his working
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
                    all("heibert" in str(email).lower() or "juan.carreno" in str(email).lower() for email in message.to)
                ):
                    
                    raise Exception(f"Email {message.to} not allowed in test mode")
                sent = self._send(message)
                if sent:
                    num_sent += 1
                    self.save_to_sent_folder(message)

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
