from rest_framework import serializers
from .models import TrafficAnalysisModel

class TrafficAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficAnalysisModel
        fields = "__all__"