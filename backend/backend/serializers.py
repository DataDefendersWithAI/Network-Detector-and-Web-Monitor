from rest_framework import serializers
from .models import Device, Website

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['mac', 'name', 'status', 'created_at']

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['url', 'tag', 'mac', 'monitor_all']
