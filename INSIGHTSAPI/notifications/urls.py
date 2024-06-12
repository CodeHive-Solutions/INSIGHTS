from django.urls import path
from .views import NotificationListView, NotificationPatchView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notifications-list"),
    path("<int:pk>/", NotificationPatchView.as_view(), name="notifications-patch"),
]
