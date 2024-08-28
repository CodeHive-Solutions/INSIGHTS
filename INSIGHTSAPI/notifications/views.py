from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
)
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer


class NotificationsViewSet(
    viewsets.GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return self.request.user.notifications.all().order_by("-created_at")

    def retrieve(self, request, pk=None):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.read = not notification.read
        notification.save()
        return Response(
            NotificationSerializer(notification).data, status=status.HTTP_200_OK
        )
