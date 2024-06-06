from django.urls import path
from .views import NotificationListView, MarkNotificationAsReadView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications-list'),
    path('read/<int:notification_id>/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),
]
