from rest_framework import generics
from .models import Device, Website
from .serializers import DeviceSerializer
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import FileResponse
import speedtest
from rest_framework.views import APIView
from .traffic_analyze import packet_find, summary_packets, show_packets
from .packet_capture import NetworkTrafficMonitor, network_monitor
import os

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
        
# Add website needs to be monitored to the database
# This view will add a new device to the database.
# POST parameters: URL, Tag, Device MAC, Monitor All or just Down

class AddWebsiteView(APIView):
    def post(self, request):
        url = request.data.get('url')
        tag = request.data.get('tag')
        mac = request.data.get('mac')
        monitor_all = request.data.get('monitor_all')
        website = Website(url=url, tag=tag, mac=mac, monitor_all=monitor_all)
        website.save()
        return Response({'message': 'Website added successfully.'})

# Return result open pcap file of host machine
# This view will return the summary and detailed information of packets in a pcap file.

class PcapOpenView(APIView):
    def post(self, request):
        pcap_file = request.data.get('pcap_file')
        if pcap_file is None or pcap_file == "":
            if os.path.exists("./output.pcap"):
                pcap_file = "./output.pcap"
            else:
                return Response({'error': 'Please provide a pcap file.'})
        filter = request.data.get('filter')
        packets = packet_find(pcap_file, filter)
        packets_summary = summary_packets(packets)
        packets_show = show_packets(packets)
        return Response({'summary': packets_summary, 'show': packets_show})

# Capture packets from host machine
# This view will capture packets from the host machine and save them to a pcap file.

class PcapCaptureView(APIView):
    def post(self, request):
        interface = request.data.get('interface')
        filter = request.data.get('filter')
        action = request.data.get('action')
        if action == 'start':
            network_monitor.reset()
            network_monitor.interface = interface
            network_monitor.filter_str = filter
            network_monitor.start_monitoring()
            return Response({'message': 'Packet capture started.'})
        if action == 'stop':
            network_monitor.stop_monitoring()
            return Response({'message': 'Packet capture stopped.'})
        if action == 'save':
            pcap_file_path = "./output.pcap"
            if os.path.exists(pcap_file_path):
                return FileResponse(
                    open(pcap_file_path, 'rb'),
                    as_attachment=True,
                    filename=os.path.basename(pcap_file_path),
                    content_type='application/vnd.tcpdump.pcap'
                )
            else:
                return Response({'error': 'Pcap file not found.'})
            
# Return a list of network interfaces available on the host machine
# This view will return a list of network interfaces available on the host machine.

class NetworkInterfacesView(APIView):
    def get(self, request):
        interfaces = os.listdir('/sys/class/net/')
        return Response({'interfaces': interfaces})
