from django.db import models
# Create your models here.
class IPdatabase(models.Model):
    ip_address = models.CharField(max_length=15)
    mac_address = models.CharField(max_length=17)
    vendor = models.CharField(max_length=50)
    device = models.CharField(max_length=50)
    os = models.CharField(max_length=50)
    open_ports = models.CharField(max_length=100)
    scan_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=False)

class IPEvent(models.Model):
    event = models.ForeignKey(IPdatabase, on_delete=models.CASCADE, related_name='events')
    ip_address = models.CharField(max_length=15)
    event_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=False)
    additional_info = models.CharField(max_length=100, null=True)

class HostDatabase(models.Model):
    host = models.CharField(max_length=50)