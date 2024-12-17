from scapy.all import sniff, PcapWriter
from threading import Thread
from colorama import Fore, Style
from scapy.all import rdpcap
import os


class PacketCapture:
    def __init__(self, interface=None, filter_str=None, pcap_file=None):
        self.interface = interface
        self.filter_str = filter_str
        self.pcap_file = pcap_file
        self.stop = False  # false means stopped
        self.packets = []
        self.pcap_writer = None
        if self.pcap_file:
            self.initialize_pcap_writer()

    def initialize_pcap_writer(self):
        try:
            self.pcap_writer = PcapWriter(
                self.pcap_file, append=False, sync=True)
        except Exception as e:
            print(f"Error initializing PcapWriter: {e}")
            self.pcap_writer = None

    def packet_handler(self, packet):
        self.packets.append(packet)
        if self.pcap_writer:
            self.pcap_writer.write(packet)
        else:
            print("Warning: pcap_writer is not initialized")

    # __init__ clone
    def reset(self, interface=None, filter_str=None, pcap_file=None):
        self.interface = interface
        self.filter_str = filter_str
        self.pcap_file = pcap_file
        self.stop = False
        self.packets = []
        self.pcap_writer = None
        if self.pcap_file:
            self.initialize_pcap_writer()

    def start_monitoring(self):
        if not self.interface:
            return False
        self.sniff_thread = Thread(target=sniff, kwargs={
            'iface': self.interface,
            'filter': self.filter_str,
            'prn': self.packet_handler,
            'stop_filter': lambda x: self.stop
        })
        self.sniff_thread.start()
        return True

    def stop_monitoring(self):
        self.stop = True
        if self.pcap_writer:
            self.pcap_writer.close()
            print(f"Packet capture saved to {self.pcap_file}")
        else:
            print("Warning: pcap_writer is not initialized")
        self.sniff_thread.join()

    def find_packets(self, filter=None):
        pkts = rdpcap(self.pcap_file) 
        pkts_dict = {}
        if filter == None or filter == "":
            for i, pkt in enumerate(pkts):
                pkts_dict[i + 1] = pkt
            return pkts_dict
        pkts_filtered = sniff(offline=pkts, filter=filter)
        for i, pkt in enumerate(pkts_filtered):
            pkts_dict[pkts.index(pkt) + 1] = pkt
        return pkts_dict

    def summary_packets(self, filtered_packets, packet_number=None):
        if packet_number == None or packet_number == "":
            return {k: v.summary() for k, v in filtered_packets.items()}
        filtered_packets = filtered_packets[packet_number]
        return filtered_packets.summary()

    def show_packets(self, filtered_packets, packet_number=None):
        if packet_number == None or packet_number == "":
            return {k: v.show(dump=True) for k, v in filtered_packets.items()}
        filtered_packets = filtered_packets[packet_number]
        return filtered_packets.show(dump=True)