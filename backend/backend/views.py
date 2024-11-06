from rest_framework import generics
from .models import Device
from .serializers import DeviceSerializer
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import speedtest
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
        try:
            st = speedtest.Speedtest(secure=True)
            st.get_best_server()
            download_speed = st.download() / 10**6  # Mbps
            upload_speed = st.upload() / 10**6      # Mbps
            ping = st.results.ping
            return Response({
                'download_speed': round(download_speed, 2),
                'upload_speed': round(upload_speed, 2),
                'ping': ping
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)