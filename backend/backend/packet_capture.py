from scapy.all import sniff, wrpcap, PcapWriter
from colorama import Fore, Style
import time
import os
from threading import Thread


class NetworkTrafficMonitor:
    def __init__(self, interface=None, filter_str=None, pcap_file="./output.pcap"):
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
        # terminate the sniffing thread
        self.sniff_thread.join()
        # clear the pcap file if the capture was stopped
        # self.__init__(self.interface, self.filter_str, self.pcap_file)


network_monitor = NetworkTrafficMonitor()
if __name__ == "__main__":
    # Example usage
    interface = "wlp0s20f3"  # Replace with your network interface
    filter_str = ""  # Capture only TCP packets on port 80
    monitor = NetworkTrafficMonitor(interface, filter_str)
    monitor.start_monitoring()
    # Capture for 10 seconds
    time.sleep(5)
    print("Stopping packet capture...")
    monitor.stop_monitoring()
