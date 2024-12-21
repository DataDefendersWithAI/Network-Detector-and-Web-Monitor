from rest_framework.response import Response

from rest_framework.views import APIView
from .models import Notification
import os

class NotificationListView(APIView):
    def get(self, request):
        try:
            return Response({
                'notifications': list(Notification.objects.values())
            })
        except Exception as e:
            return Response({
                'error': str(e)
            })
    
class NotificationUpdateView(APIView):
    def put(self, request, id):
        try:
            action = request.data['action']
            if action == 'read':
                Notification.objects.filter(id=id).update(status='Read')
                return Response({
                    'message': 'Notification updated'
                })
            else:
                return Response({
                    'error': 'Invalid action'
                })
        except Exception as e:
            return Response({
                'error': str(e)
            })
    def delete(self, request, id):
        try:
            Notification.objects.filter(id=id).delete()
            return Response({
                'message': 'All notifications deleted'
            })
        except Exception as e:
            return Response({
                'error': str(e)
            })

class NewNotificationListView(APIView):
    def get(self, request):
        try:
            return Response({
                'new_notifications': Notification.objects.filter(status='New').count()
            })
        except Exception as e:
            return Response({
                'error': str(e)
            })