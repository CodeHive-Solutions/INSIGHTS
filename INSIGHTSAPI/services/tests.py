from django.test import TestCase
from .emails import send_email


# Create your tests here.
class EmailServiceTest(TestCase):
    def test_send_email(self):
        """Test send email."""
        subject = "Test email"
        message = "Test email"
        to_emails = ["heibert.mogollon@cyc-bpo.com"]
        send_email("mismetas", subject, message, to_emails)