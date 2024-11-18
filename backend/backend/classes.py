from scapy.all import sniff, wrpcap, PcapWriter, rdpcap
from colorama import Fore, Style
from threading import Thread
import time

OPENED_PCAP_FILE = "./opened.pcap"
CAPTURED_PCAP_FILE = "./captured.pcap"

class NetworkTrafficMonitor:
    def __init__(self, interface=None, filter_str=None, pcap_file=None):
        self.interface = interface
        self.filter_str = filter_str
        self.pcap_file = pcap_file
        self.stop = False
        self.packets = []
        self.pcap_writer = PcapWriter(self.pcap_file, append=False, sync=True)

    def packet_handler(self, packet):
        self.packets.append(packet)
        self.pcap_writer.write(packet)
    
    def reset(self):
        self.__init__(self.interface, self.filter_str, self.pcap_file)

    def start_monitoring(self):
        if not self.interface:
            print(f"{Fore.RED}Please specify a network interface to capture packets.{Style.RESET_ALL}")
            return
        print(f"{Fore.YELLOW}Starting packet capture on interface: {self.interface}, with filter: {self.filter_str if self.filter_str else 'No filter'}...{Style.RESET_ALL}")
        self.sniff_thread = Thread(target=sniff, kwargs={
            'iface': self.interface,
            'filter': self.filter_str,
            'prn': self.packet_handler,
            'stop_filter': lambda x: self.stop
        })
        self.sniff_thread.start()

    def stop_monitoring(self):
        self.stop = True
        print(f"{Fore.YELLOW}Stopping packet capture...{Style.RESET_ALL}")
        self.pcap_writer.close()
        print(f"{Fore.GREEN}Packet capture saved to {self.pcap_file}{Style.RESET_ALL}")
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
