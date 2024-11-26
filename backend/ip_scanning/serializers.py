from ip_scanning.models import IPdatabase
from rest_framework import serializers

class IPdatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPdatabase
        fields = '__all__'