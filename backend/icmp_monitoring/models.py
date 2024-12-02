from django.db import models

# Create your models here.
class ICMPdatabase(models.Model):
    """
    ICMP database model with fields for IP address, scan date, is active, max RTT, min RTT, and average RTT

    Fields:
    ip_address (CharField): The IP address of the host
    scan_date (DateTimeField): The date and time the scan was performed
    is_active (BooleanField): A flag indicating if the host is active
    max_rtt (FloatField): The maximum round-trip time (RTT) in milliseconds
    min_rtt (FloatField): The minimum round-trip time (RTT) in milliseconds
    avg_rtt (FloatField): The average round-trip time (RTT) in milliseconds
    """
    ip_address = models.CharField(max_length=15)
    scan_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=False)
    max_rtt = models.FloatField(null=True)
    min_rtt = models.FloatField(null=True)
    avg_rtt = models.FloatField(null=True)
