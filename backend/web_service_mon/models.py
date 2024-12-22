from django.db import models

# Website model
class Website(models.Model):
    url = models.URLField(max_length=200, primary_key=True)
    tag = models.CharField(max_length=100, default='Default')
    monitor_all_events = models.BooleanField(default=False)
    monitor_down_events = models.BooleanField(default=False)
    dest_ip = models.GenericIPAddressField(null=True, default=None) # Destination IP address, default is None
    note = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.tag
    
# Website List of monitored results
class WebsiteResult(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE, to_field='url')
    status_code = models.IntegerField()
    latency = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.website.tag