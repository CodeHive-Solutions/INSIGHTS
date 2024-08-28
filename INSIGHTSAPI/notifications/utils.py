"""Utility functions for the notifications app."""

from users.models import User
from .models import Notification


def create_notification(title: str, message: str, user=User):
    """Create a notification for a user."""
    notification = Notification.objects.create(title=title, message=message, user=user)
    return notification
