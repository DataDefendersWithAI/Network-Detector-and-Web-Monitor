from django.db import models

class Device(models.Model):
    mac = models.CharField(max_length=17, primary_key=True)  # MAC address format
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50)  # Online, Offline, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
