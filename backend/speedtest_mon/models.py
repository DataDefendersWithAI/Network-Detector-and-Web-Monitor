from django.db import models

# Speed Test model
class SpeedTest(models.Model):
    download_speed = models.FloatField()
    upload_speed = models.FloatField()
    ping = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Download: {self.download_speed:.2f} Mbps / Upload: {self.upload_speed:.2f} Mbps / Ping: {self.ping} ms'