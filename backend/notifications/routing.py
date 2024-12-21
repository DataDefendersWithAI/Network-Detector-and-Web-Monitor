from django.urls import path
from .consumers import NotificationConsumer, NewNotificationConsumer

websocket_urlpatterns = [
    path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/new-notifications/', NewNotificationConsumer.as_asgi()),
]