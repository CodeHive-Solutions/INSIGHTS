from django.core.mail.backends.smtp import EmailBackend
from smtplib import SMTP
import ssl


class CustomEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False

        try:
            self.connection = SMTP(
                self.host, self.port
            )
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            self.connection.starttls(context=context)
            self.connection.login(self.username, self.password)
            return True
        except Exception as e:
            if not self.fail_silently:
                raise

    def close(self):
        try:
            if self.connection is not None:
                self.connection.quit()
        except Exception:
            if not self.fail_silently:
                raise
        finally:
            self.connection = None
