import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("notifications", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notifications", self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({
            "message": message
        }))

class NewNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("new_notifications", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("new_notifications", self.channel_name)

    async def receive(self, text_data):
        pass
    
    # send new_notification count
    async def send_new_notification(self, event):
        count = event["count"]
        await self.send(text_data=json.dumps({
            "count": count
        }))
       