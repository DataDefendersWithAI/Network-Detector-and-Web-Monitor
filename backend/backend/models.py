from django.db import models

class Device(models.Model):
    mac = models.CharField(max_length=17, primary_key=True)  # MAC address format
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50)  # Online, Offline, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
# Website model
class Website(models.Model):
    url = models.URLField(max_length=200)
    tag = models.CharField(max_length=100, default='Default')
    mac = models.CharField(max_length=17, primary_key=True)
    monitor_all = models.BooleanField()
    
    def __str__(self):
        return self.tag
    
# Website List of monitored results
class WebsiteResult(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE, to_field='mac')
    status_code = models.IntegerField()
    latency = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.website.tag
    
# Speed Test model
class SpeedTest(models.Model):
    download_speed = models.FloatField()
    upload_speed = models.FloatField()
    ping = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.download_speed} Mbps / {self.upload_speed} Mbps / {self.ping} ms'