from .models import Notification
import time
from django.db.models.signals import post_save
from django.dispatch import receiver

class DatabaseChangeDetector:
  def __init__(self):
    self.last_checked = time.time()

  def check_for_changes(self):
    # Logic to check for changes in the database
    new_notifications = Notification.objects.filter(timestamp__gt=self.last_checked)
    if new_notifications.exists():
      self.handle_new_notifications(new_notifications)
    self.last_checked = time.time()

  def handle_new_notifications(self, new_notifications):
    for notification in new_notifications:
      print(f"New notification: {notification.message}")

@receiver(post_save, sender=Notification)
def notification_saved(sender, instance, **kwargs):
  detector = DatabaseChangeDetector()
  detector.check_for_changes()