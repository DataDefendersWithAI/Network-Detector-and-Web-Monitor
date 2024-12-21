from .models import Device
from .serializers import DeviceSerializer

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import FileResponse

from rest_framework.views import APIView

# List all devices (for the dashboard)
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

# Retrieve a device by MAC address (for device details)
class DeviceDetailView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'mac'