from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification, LastChecked
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
import time

import sys
sys.path.append('../')
from web_service_mon.models import WebsiteResult
from speedtest_mon.models import SpeedTest
from ip_scanning.models import IPdatabase
from packet_capture.models import CapturedPacket


class DatabaseChangeDetector:
    def __init__(self):
        last_checked_record, created = LastChecked.objects.get_or_create(id=1, defaults={'last_checked_float': time.time(),
                                                                                         'last_checked_date': timezone.now()})
        if created:
            last_checked_record.save()
        self.last_checked_float = last_checked_record.last_checked_float
        self.last_checked_date = last_checked_record.last_checked_date

    def check_for_changes(self):
        new_website_results = WebsiteResult.objects.filter(
            created_at__gt=self.last_checked_date)
        new_speed_tests = SpeedTest.objects.filter(
            created_at__gt=self.last_checked_date)
        new_ip_databases = IPdatabase.objects.filter(
            scan_date__gt=self.last_checked_date)
        new_captured_packets = CapturedPacket.objects.filter(
            end_time__gt=self.last_checked_date)

        if new_website_results.exists():
            Notification.objects.create(
                message="New WebsiteResult detected", status="New")
            self.send_notification("New WebsiteResult detected")
        if new_speed_tests.exists():
            Notification.objects.create(
                message="New SpeedTest detected", status="New")
            self.send_notification("New SpeedTest detected")
        if new_ip_databases.exists():
            Notification.objects.create(
                message="New IPdatabase entry detected", status="New")
            self.send_notification("New IPdatabase entry detected")
        if new_captured_packets.exists():
            Notification.objects.create(
                message="New CapturedPacket detected", status="New")
            self.send_notification("New CapturedPacket detected")

        LastChecked.objects.filter(id=1).update(
            last_checked_float=time.time(), 
            last_checked_date=timezone.now()
        )

    def send_notification(self, message):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notifications",
            {
                "type": "send_notification",
                "message": message
            }
        )

# @receiver(post_save, sender=IPdatabase)
# @receiver(post_save, sender=SpeedTest)
# @receiver(post_save, sender=WebsiteResult)
# @receiver(post_save, sender=CapturedPacket)
# def notification_saved(sender, instance, **kwargs):
#   detector = DatabaseChangeDetector()
#   detector.check_for_changes()