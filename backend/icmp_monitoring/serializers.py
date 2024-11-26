from rest_framework import serializers
from .models import ICMPdatabase


class ICMPdatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICMPdatabase
        fields = '__all__'