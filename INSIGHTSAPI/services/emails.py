"""Email service to send emails to users """

from django.core.mail import send_mail


class EmailService:
    """Email service to send emails to users"""

    def send_email(self, sender_email, recipient_email, subject, message):
        """Send email to recipient_email with subject and message"""
        try:
            # Send mail
            send_mail(
                subject,
                message,
                sender_email,  # Sender's email address
                [recipient_email],  # List of recipient email addresses
                fail_silently=False,
            )
            print("Email sent successfully!")
        except Exception as e:
            print(f"Error sending email: {e}")
