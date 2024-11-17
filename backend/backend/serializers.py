from rest_framework import serializers
from .models import Device, Website, WebsiteResult, SpeedTest

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['mac', 'name', 'status', 'created_at']

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['url', 'tag', 'monitor_all', 'monitor_down']

class WebsiteResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteResult
        fields = ['website', 'status_code', 'latency', 'created_at']

class SpeedTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeedTest
        fields = ['download_speed', 'upload_speed', 'ping', 'created_at']