from django.db import models
from users.models import User


class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    title = models.CharField(max_length=100, null=False, blank=False)
    message = models.CharField(max_length=255, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:20]}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the notification first
        notifications = Notification.objects.filter(user=self.user).order_by(
            "-created_at"
        )
        if notifications.count() > 10:
            for notification in notifications[10:]:
                notification.delete()
