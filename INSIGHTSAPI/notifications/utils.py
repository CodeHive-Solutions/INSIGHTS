"""Utility functions for the notifications app."""

from .models import Notification


def create_notification(title, message, user):
    """Create a notification for a user."""
    Notification.objects.create(title=title, message=message, user=user)
