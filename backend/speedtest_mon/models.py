from django.db import models

# Speed Test model
class SpeedTest(models.Model):
    download_speed = models.FloatField()
    upload_speed = models.FloatField()
    ping = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.download_speed} Mbps / {self.upload_speed} Mbps / {self.ping} ms'