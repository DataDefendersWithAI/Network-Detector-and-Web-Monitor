from rest_framework import serializers
from .models import CapturedPacket

class CapturedPacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapturedPacket
        fields = "__all__"