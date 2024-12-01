from rest_framework import serializers
from .models import SpeedTest

class SpeedTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeedTest
        fields = ['download_speed', 'upload_speed', 'ping', 'created_at']