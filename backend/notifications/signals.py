from django.db.models.signals import post_save
from django.dispatch import receiver

from .classes import DatabaseChangeDetector
import sys
sys.path.append('../')
from packet_capture.models import CapturedPacket
from ip_scanning.models import IPdatabase
from icmp_monitoring.models import ICMPdatabase
from speedtest_mon.models import SpeedTest
from web_service_mon.models import WebsiteResult
from traffic_analysis.models import TrafficAnalysisModel
from .models import Notification


@receiver(post_save, sender=IPdatabase)
@receiver(post_save, sender=SpeedTest)
@receiver(post_save, sender=ICMPdatabase)
@receiver(post_save, sender=WebsiteResult)
@receiver(post_save, sender=CapturedPacket)
@receiver(post_save, sender=TrafficAnalysisModel)
# @receiver(post_save, sender=Notification)
def notification_saved(sender, instance, **kwargs):
  detector = DatabaseChangeDetector()
  detector.check_for_changes()
