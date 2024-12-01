from rest_framework import serializers
from .models import Website, WebsiteResult

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['url', 'tag', 'monitor_all_events', 'monitor_down_events', 'dest_ip', 'note']

class WebsiteResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteResult
        fields = ['website', 'status_code', 'latency', 'created_at']