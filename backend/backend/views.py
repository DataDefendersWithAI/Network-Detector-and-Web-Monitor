from .models import Device
from .serializers import DeviceSerializer

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import FileResponse

from rest_framework.views import APIView
from .classes import PacketCapture, TrafficAnalysis, OPENED_PCAP_FILE, CAPTURED_PCAP_FILE, PCAP_FOLDER
import os

import requests

# Initialize the objects
packet_capture = PacketCapture()
traffic_analysis = TrafficAnalysis()

# List all devices (for the dashboard)
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

# Retrieve a device by MAC address (for device details)
class DeviceDetailView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'mac'

# Return result open pcap file of host machine
# This view will return the summary and detailed information of packets in a pcap file.
class PcapOpenView(APIView):
    def post(self, request):
        pcap_file = request.data.get('pcap_file')
        filter = request.data.get('filter')

        # If pcap file is None, read the pcap file from the host machine that captured before
        if pcap_file is None:
            pcap_file = CAPTURED_PCAP_FILE
            if os.path.exists(pcap_file):
                packet_capture.pcap_file = pcap_file
                packets = packet_capture.find_packets(filter)
                packets_summary = packet_capture.summary_packets(packets)
                packets_show = packet_capture.show_packets(packets)
                return Response({'summary': packets_summary, 'show': packets_show})
        
        # If pcap file is not None, open it and read the packets
        try:
            pcap_data = pcap_file.read()
            with open(OPENED_PCAP_FILE, 'wb') as f:
                f.write(pcap_data)
            packet_capture.pcap_file = OPENED_PCAP_FILE
            packets = packet_capture.find_packets(filter)
            packets_summary = packet_capture.summary_packets(packets)
            packets_show = packet_capture.show_packets(packets)
            return Response({'summary': packets_summary, 'show': packets_show})
        except Exception as e:
            return Response({'error': str(e)})
    
# Capture packets from host machine
# This view will capture packets from the host machine and save them to a pcap file.
class PcapCaptureView(APIView):
    def post(self, request):
        interface = request.data.get('interface')
        filter = request.data.get('filter')
        action = request.data.get('action')
        if action == 'start':
            packet_capture.reset()
            packet_capture.pcap_file = CAPTURED_PCAP_FILE
            packet_capture.interface = interface
            packet_capture.filter_str = filter
            packet_capture.start_monitoring()
            return Response({'message': 'Packet capture started.'})
        if action == 'stop':
            packet_capture.stop_monitoring()
            return Response({'message': 'Packet capture stopped.'})
        if action == 'save':
            pcap_file_path = CAPTURED_PCAP_FILE
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

# Return graphs of traffic analysis
class PcapAnalysisView(APIView):
    def post(self, request):
        file_obj = request.FILES['pcap_file']
        filter = request.data.get('filter', '')
        debug = request.data.get('debug', 'false').lower() == 'true'

        # Save file locally
        file_path = os.path.join(PCAP_FOLDER, file_obj.name)
        with open(file_path, 'wb') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)

        # Process file (call your processing function here)
        traffic_analysis.file_path = file_path
        traffic_analysis.file_name = file_obj.name
        traffic_analysis.filter = filter
        traffic_analysis.debug = debug
        analysis_results = traffic_analysis.get_graph_results()

        return Response(analysis_results)
