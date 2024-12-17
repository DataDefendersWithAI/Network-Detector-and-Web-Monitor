from rest_framework.response import Response

from rest_framework.views import APIView
from .models import Notification
import os

class NotificationListView(APIView):
    def get(self, request):
        return Response({
            'notifications': list(Notification.objects.values())
        })
    
class NotificationUpdateView(APIView):
    def put(self, request, id):
        action = request.data.get('action')
        if action == 'read':
            Notification.objects.filter(id=id).update(status='read')
            return Response({
                'message': f'Notification with id {id} marked as read'
            })
        elif action == 'delete':
            Notification.objects.filter(id=id).delete()
            return Response({
                'message': f'Notification with id {id} deleted'
            })