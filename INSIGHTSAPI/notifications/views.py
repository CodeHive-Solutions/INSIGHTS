# notifications/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all().order_by('-created_at')

class NotificationPatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if request.user.notifications.filter(pk=kwargs['pk']).exists():
            notification = Notification.objects.get(pk=kwargs['pk'])
            notification.read = True
            notification.save()
            return Response(status=200)
        return Response({'error': 'Notification not found'}, status=404)