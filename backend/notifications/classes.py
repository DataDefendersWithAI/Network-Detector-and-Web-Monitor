from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification, LastChecked, LastCheckedIP
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
import time

import sys
sys.path.append('../')
from web_service_mon.models import WebsiteResult
from speedtest_mon.models import SpeedTest
from ip_scanning.models import IPdatabase
from icmp_monitoring.models import ICMPdatabase
from packet_capture.models import CapturedPacket
from traffic_analysis.models import TrafficAnalysisModel


class DatabaseChangeDetector:
    def __init__(self):
        # Get the last checked record from the LastChecked table, if it doesn't exist, create it
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
        new_icmp_monitorings = ICMPdatabase.objects.filter(
            scan_date__gt=self.last_checked_date)
        new_captured_packets = CapturedPacket.objects.filter(
            end_time__gt=self.last_checked_date)
        new_traffic_analysis = TrafficAnalysisModel.objects.filter(
            scan_at__gt=self.last_checked_date)

        if new_website_results.exists():
            Notification.objects.create(
                message=f"Web service new result of {new_website_results.first().website.url}, status: {new_website_results.first().status_code}", 
                status="New",
                severity="info",
                date=new_website_results.first().created_at)
            self.send_notification("New WebsiteResult detected")
        if new_speed_tests.exists():
            Notification.objects.create(
                message=f"New speed test result: {new_speed_tests.first()}", 
                status="New",
                severity="info",
                date=new_speed_tests.first().created_at)
            self.send_notification("New SpeedTest detected")
        if new_ip_databases.exists():
            for new_ip_database in new_ip_databases:
                # Check if the IP address is already in the LastCheckedIP table
                if not LastCheckedIP.objects.filter(ip_address=new_ip_database.ip_address).exists():
                    Notification.objects.create(
                        message=f"New IP entry: {new_ip_database.ip_address}",
                        status="New",
                        severity="warning",
                        date=new_ip_database.scan_date)
                # else nothing TODO: add a notification for the IP changed base on mac address
            self.send_notification("New IPdatabase entry detected")
        if new_icmp_monitorings.exists():
            Notification.objects.create(
                message=f"New ICMP monitoring result: {new_icmp_monitorings.first()}", 
                status="New",
                severity="info",
                date=new_icmp_monitorings.first().scan_date)
            self.send_notification("New ICMPdatabase entry detected")
        if new_captured_packets.exists():
            Notification.objects.create(
                message=f"New packets captured {new_captured_packets.first().pcap_file}", 
                status="New",
                severity="warning",
                date=new_captured_packets.first().end_time)
            self.send_notification("New CapturedPacket detected")
        if new_traffic_analysis.exists():
            severity = "info"
            if new_traffic_analysis.first().status == "clean":
                severity = "good"
            elif new_traffic_analysis.first().status == "unknown":
                severity = "info"
            elif new_traffic_analysis.first().status == "suspicious":
                severity = "important"
            
            Notification.objects.create(
                message=f"PCAP file analysis completed, {new_traffic_analysis.first().pcap_file} is {new_traffic_analysis.first().status}", 
                status="New",
                severity=severity,
                date=new_traffic_analysis.first().scan_at)
            self.send_notification("New TrafficAnalysisModel detected")

        # Send the number of new notifications to the frontend
        self.send_new_notification(Notification.objects.filter(status="New").count())

        # Update the LastChecked table
        LastChecked.objects.filter(id=1).update(
            last_checked_float=time.time(), 
            last_checked_date=timezone.now()
        )

        # Update the LastCheckedIP table
        # LastCheckedIP.objects.all().delete()
        for new_ip_database in new_ip_databases:
            LastCheckedIP.objects.get_or_create(id=1, ip_address=new_ip_database.ip_address)

    def send_notification(self, message):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notifications",
            {
                "type": "send_notification",
                "message": message
            }
        )
    
    def send_new_notification(self, count):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "new_notifications",
            {
                "type": "send_new_notification",
                "count": count
            }
        )