from django.db.models.signals import post_save
from django.dispatch import receiver

from .classes import DatabaseChangeDetector
import sys
sys.path.append('../')
from packet_capture.models import CapturedPacket
from ip_scanning.models import IPdatabase
from speedtest_mon.models import SpeedTest
from web_service_mon.models import WebsiteResult


@receiver(post_save, sender=IPdatabase)
@receiver(post_save, sender=SpeedTest)
@receiver(post_save, sender=WebsiteResult)
@receiver(post_save, sender=CapturedPacket)
def notification_saved(sender, instance, **kwargs):
  print("Signal received")
  detector = DatabaseChangeDetector()
  detector.check_for_changes()