from ip_scanning.models import IPdatabase, IPEvent
from rest_framework import serializers


class IPEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPEvent
        fields = ('id', 'event', 'ip_address', 'event_date', 'is_active', 'additional_info')

class IPdatabaseSerializer(serializers.ModelSerializer):
    events = IPEventSerializer(many=True, read_only=True)
    class Meta:
        model = IPdatabase
        fields = (
            'id',
            'ip_address',
            'mac_address',
            'vendor',
            'device',
            'os',
            'open_ports',
            'scan_date',
            'is_active',
            'events'
        )

