from django.db import models

# Captured Packets (PCAP) model
class CapturedPacket(models.Model):
    interface = models.CharField(max_length=100)
    filter_str = models.CharField(max_length=255, null=True, blank=True)
    pcap_file = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('clean', 'Clean'),
            ('suspicious', 'Suspicious'),
            ('unknown', 'Unknown'),
        ],
        default='unknown'
    )

    def __str__(self):
        return f'Capture on {self.interface} with filter {self.filter_str}'