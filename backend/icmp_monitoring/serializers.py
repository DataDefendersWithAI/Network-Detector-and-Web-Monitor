from rest_framework import serializers
from .models import ICMPdatabase


class ICMPdatabaseSerializer(serializers.ModelSerializer):
    """
    Serializer for the ICMP database model
    """
    class Meta:
        model = ICMPdatabase
        fields = '__all__'