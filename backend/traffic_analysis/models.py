from django.db import models

# Traffic Analysis model
class TrafficAnalysisModel(models.Model):
    pcap_file = models.CharField(max_length=255)
    scan_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()
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
        return f'Traffic analysis on {self.pcap_file}'