"""Utility functions for the notifications app."""

from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


def create_notification(title: str, message: str, user) -> Notification:
    """Create a notification for a user."""
    if not isinstance(user, User):
        raise ValueError("user must be an instance of User model.")
    notification = Notification.objects.create(title=title, message=message, user=user)
    return notification
