"""Utility functions for the notifications app."""
from .models import Notification

def create_notification(user, title, message):
    """Create a notification for a user."""
    Notification.objects.create(user=user, title=title, message=message)