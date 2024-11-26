from django.db import models

# Create your models here.
class ICMPdatabase(models.Model):
    ip_address = models.CharField(max_length=15)
    scan_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=False)
    max_rtt = models.FloatField(null=True)
    min_rtt = models.FloatField(null=True)
    avg_rtt = models.FloatField(null=True)
