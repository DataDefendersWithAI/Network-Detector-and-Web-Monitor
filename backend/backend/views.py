from .models import Device, Website, SpeedTest
from .serializers import DeviceSerializer
from .cron import run_speed_test, run_website_monitor

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

import speedtest
import requests

# List all devices (for the dashboard)
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

# Retrieve a device by MAC address (for device details)
class DeviceDetailView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'mac'

# Website Monitor View
# This view will monitor a website and return the status code and latency.
# The URL is passed as a GET parameter.
class WebsiteMonitorView(APIView):
    def get(self, request):
        try:
            url = request.query_params.get('url')
            response = requests.get(url, verify=False, timeout=10)
            status_code = response.status_code
            latency = response.elapsed.total_seconds()
        except requests.RequestException:
            status_code = 503
            latency = None
        return Response({'url': url, 'status_code': status_code, 'latency': latency})

# Speed Test View
# This view will run a speed test and return the download and upload speeds.
# The speedtest library is used to perform the speed test.
class SpeedTestView(APIView):
    def get(self, request):
        # Get GET parameters "action" to check if the user wants to list all speed tests or delete
        action = request.query_params.get('action')
        # If list is not None, return the list of all speed tests
        if action == "list":
            speed_tests = SpeedTest.objects.all()
            return Response([{
                'download_speed': round(speed_test.download_speed, 2),
                'upload_speed': round(speed_test.upload_speed, 2),
                'ping': speed_test.ping,
                'created_at': speed_test.created_at
            } for speed_test in speed_tests])
        # If list is None, run a new speed test
        try:
            download_speed, upload_speed, ping = run_speed_test()  

            return Response({
                'download_speed': round(download_speed, 2),
                'upload_speed': round(upload_speed, 2),
                'ping': ping
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def delete(self, request):
        date_delete = request.query_params.get('date')
        # Delete "/" in date_delete
        date_delete = date_delete.replace("/", "")
        # date_delete like this: 2024-11-15T10:28:28.953333Z/
        speed_test_date = SpeedTest.objects.filter(created_at=date_delete)
        speed_test_date.delete()
        return Response({'message': 'Speed tests deleted successfully.'})
        
# Add website needs to be monitored to the database
# This view will add a new device to the database.
# POST parameters: URL, Tag, Device MAC, Monitor All or just Down

class AddWebsiteView(APIView):
    def post(self, request):
        url = request.data.get('url')
        tag = request.data.get('tag')
        mac = request.data.get('mac')
        all_events = request.data.get('all_events')
        all_down_events = request.data.get('all_down_events')
        website = Website(url=url, tag=tag, mac=mac, monitor_all_events=all_events, monitor_down_events=all_down_events)
        website.save()
        return Response({'message': 'Website added successfully.'})