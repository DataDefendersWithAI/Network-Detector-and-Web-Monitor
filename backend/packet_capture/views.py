from rest_framework.response import Response
from django.http import FileResponse

from rest_framework.views import APIView
from .models import CapturedPacket
from .classes import PacketCapture
from django.utils import timezone
import os

PCAP_FOLDER = "pcap_files"

# Initialize the objects
monitor = PacketCapture()

# Upload a pcap file to the host machine
# This view will upload a pcap file to the host machine.
class PcapUploadView(APIView):
    def post(self, request):
        # pcap_file also stores the pcap file data
        pcap_file = request.data.get('pcap_file')
        full_path_pcap_file = os.path.join(PCAP_FOLDER, pcap_file.name)
        try:
            with open(full_path_pcap_file, 'wb') as f:
                f.write(pcap_file.read())
            monitor.pcap_file = full_path_pcap_file
            packets = monitor.find_packets()
            packets_summary = monitor.summary_packets(packets)
            packets_show = monitor.show_packets(packets)
            return Response({'summary': packets_summary, 'show': packets_show})
        except Exception as e:
            return Response({'error': str(e)})

# Return result open pcap file of host machine
# This view will return the summary and detailed information of packets in a pcap file.
class PcapOpenView(APIView):
    def post(self, request):

        pcap_file = request.data.get('pcap_file')
        filter = request.data.get('filter')

        # If pcap file is None, read the pcap file from the host machine that is capturing (captured_{number_of_capture}.pcap)
        if pcap_file is None:
            pcap_file = CapturedPacket.objects.last().pcap_file
            full_path_pcap_file = os.path.join(PCAP_FOLDER, pcap_file)
            if os.path.exists(full_path_pcap_file):
                try:
                    monitor.pcap_file = full_path_pcap_file
                    packets = monitor.find_packets(filter)
                    packets_summary = monitor.summary_packets(packets)
                    packets_show = monitor.show_packets(packets)
                    return Response({'summary': packets_summary, 'show': packets_show})
                except Exception as e:
                    return Response({'error': str(e)})
            else:
                return Response({'error': 'Pcap file not found.'})
        else:
            # If pcap file is not None, open it and read the packets
            full_path_pcap_file = os.path.join(PCAP_FOLDER, pcap_file)
            try:
                pcap_data = open(full_path_pcap_file, 'rb').read()
                if not os.path.exists(full_path_pcap_file):
                    with open(full_path_pcap_file, 'wb') as f:
                        f.write(pcap_data)
                monitor.pcap_file = full_path_pcap_file
                packets = monitor.find_packets(filter)
                packets_summary = monitor.summary_packets(packets)
                packets_show = monitor.show_packets(packets)
                return Response({'summary': packets_summary, 'show': packets_show})
            except Exception as e:
                return Response({'error': str(e)})

# List all the captured packets
# This view will return a list of all the captured packets.
class PcapListView(APIView):
    def get(self, request):
        packets = CapturedPacket.objects.all()
        packet_list = []
        for packet in packets:
            end_time = format(packet.end_time, '%Y-%m-%d %H:%M:%S') if packet.end_time else None
            packet_list.append({
                'id': packet.id,
                'interface': packet.interface,
                'start_time': packet.start_time,
                'end_time': end_time,
                'pcap_file': packet.pcap_file,
                'status': packet.status
            })
        return Response({'packets': packet_list})
    
class PcapDeleteView(APIView):
    def post(self, request):
        pcap_file = request.data.get('pcap_file')
        full_path_pcap_file = os.path.join(PCAP_FOLDER, pcap_file)
        if os.path.exists(full_path_pcap_file):
            try:
                # remove the record from the database first
                CapturedPacket.objects.filter(pcap_file=pcap_file).delete()
                # Delete the pcap file
                os.remove(full_path_pcap_file)
                return Response({'message': 'Pcap file deleted.'})
            except Exception as e:
                return Response({'error': str(e)})
        else:
            return Response({'error': 'Pcap file not found.'})

# Capture packets from host machine
# This view will capture packets from the host machine and save them to a pcap file.
class PcapCaptureView(APIView):
    def post(self, request):
        interface = request.data.get('interface')
        filter = request.data.get('filter')
        action = request.data.get('action')
        if action == 'start':
            packet_capture = CapturedPacket.objects.create(
                interface=interface,
                filter_str=filter,
                start_time=timezone.now(),
                pcap_file="captured"+'_'+str(CapturedPacket.objects.count())+'.pcap',
                status='unknown'
            )
            full_path_pcap_file = os.path.join(PCAP_FOLDER, packet_capture.pcap_file)
            packet_capture.save()
            monitor.reset(interface=interface, filter_str=filter, pcap_file=full_path_pcap_file)
            if monitor.start_monitoring() == True:
                return Response({'message': 'Packet capture started.'})
            else:
                return Response({'error': f'Starting packet capture failed. {monitor.interface}'})
        if action == 'stop':
            packet_capture = CapturedPacket.objects.filter(status='unknown').last()
            if packet_capture:
                packet_capture.end_time = timezone.now()
                packet_capture.save()
                if monitor.stop_monitoring() == True:
                    return Response({'message': 'Packet capture stopped.'})
                else:
                    return Response({'error': 'Stopping packet capture failed.'})
            else:
                return Response({'error': 'No active packet capture found.'})
        if action == 'save':
            pcap_file_path = monitor.pcap_file
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
