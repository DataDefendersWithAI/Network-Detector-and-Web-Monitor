from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scapy.all import sniff, wrpcap, PcapWriter, rdpcap
from werkzeug.utils import secure_filename
from colorama import Fore, Style
import matplotlib.pyplot as plt
from threading import Thread
from scapy.all import *
from io import BytesIO
import networkx as nx
import torch
import time
import os

OPENED_PCAP_FILE = "pcap_files/opened.pcap"
CAPTURED_PCAP_FILE = "pcap_files/captured.pcap"
PCAP_FOLDER = "pcap_files"

class PacketCapture:
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

class TrafficAnalysis:
    def __init__(self, file_path = None, filter = None, debug = False):
        # Initialize an empty list to store textual data.
        self.file_path = file_path
        self.file_name = None
        self.filter = filter
        self.debug = debug
        self.text_data = []
        self.packets_brief = {}
        self.forward_packets = {}
        self.backward_packets = {}
        self.protocols = []
        self.protocol_counts = {}
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self.classes = [
            'Analysis',
            'Backdoor',
            'Bot',
            'DDoS',
            'DoS',
            'DoS GoldenEye',
            'DoS Hulk',
            'DoS SlowHTTPTest',
            'DoS Slowloris',
            'Exploits',
            'FTP Patator',
            'Fuzzers',
            'Generic',
            'Heartbleed',
            'Infiltration',
            'Normal',
            'Port Scan',
            'Reconnaissance',
            'SSH Patator',
            'Shellcode',
            'Web Attack - Brute Force',
            'Web Attack - SQL Injection',
            'Web Attack - XSS',
            'Worms']
        self.tokenizer = AutoTokenizer.from_pretrained("rdpahalavan/bert-network-packet-flow-header-payload")
        self.model = AutoModelForSequenceClassification.from_pretrained("rdpahalavan/bert-network-packet-flow-header-payload")
        self.model = self.model.to(self.device)
    
    def processing_packet_conversion(self, packet):
        # Clone the packet for processing without modifying the original.
        packet_2 = packet

        while packet_2:
            # Extract and count protocol layers in the packet.
            layer = packet_2[0]
            if layer.name not in self.protocol_counts:
                self.protocol_counts[layer.name] = 0
            else:
                self.protocol_counts[layer.name] += 1
            self.protocols.append(layer.name)

            # Break if there are no more payload layers.
            if not layer.payload:
                break
            packet_2 = layer.payload

        # Extract relevant information for feature creation.
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        src_port = packet.sport
        dst_port = packet.dport
        ip_length = len(packet[IP])
        ip_ttl = packet[IP].ttl
        ip_tos = packet[IP].tos
        tcp_data_offset = packet[TCP].dataofs
        tcp_flags = packet[TCP].flags

        # Process payload content and create a feature string.
        payload_bytes = bytes(packet.payload)
        payload_length = len(payload_bytes)
        payload_content = payload_bytes.decode('utf-8', 'replace')
        payload_decimal = ' '.join(str(byte) for byte in payload_bytes)
        final_data = "0" + " " + "0" + " " + "195" + " " + "-1" + " " + str(src_port) + " " + str(dst_port) + " " + str(ip_length) + " " + str(payload_length) + " " + str(ip_ttl) + " " + str(ip_tos) + " " + str(tcp_data_offset) + " " + str(int(tcp_flags)) + " " + "-1" + " " + str(payload_decimal)
        return final_data


    # Function for predicting packet categories on GPU and updating briefs.
    def predictingRowsCategoryOnGPU(self, file_path, filter, debug):
        self.packets_brief.clear()  # Clear the dictionary tracking packet briefs.

        packets_nbr = 0  # Initialize packet counter.
        with PcapReader(file_path) as pcap:  # Iterate through packets in the pcap file.
            for pkt in pcap:
                if IP in pkt:  # Check for IPv4 packets.
                    if TCP in pkt:  # Ensure the packet is TCP.

                        # Filter packets based on payload content.
                        payload_bytes_to_filter = bytes(pkt.payload)
                        if filter in payload_bytes_to_filter:

                            # Process and truncate packet data.
                            input_line = self.processing_packet_conversion(pkt)
                            if input_line is not None:
                                truncated_line = input_line[:1024]

                                # Tokenize the truncated input and move it to the specified device.
                                tokens = self.tokenizer(truncated_line, return_tensors="pt")
                                tokens = {key: value.to(self.device) for key, value in tokens.items()}

                                # Pass tokens through the pre-trained model for prediction.
                                outputs = self.model(**tokens)

                                logits = outputs.logits
                                probabilities = logits.softmax(dim=1)
                                predicted_class = torch.argmax(probabilities, dim=1).item()

                                predictedAttack = self.classes[predicted_class]

                                # Update packet brief dictionary for non-normal packets.
                                if predictedAttack != "Normal":
                                    if predictedAttack not in self.packets_brief:
                                        self.packets_brief[predictedAttack] = 1
                                    else:
                                        self.packets_brief[predictedAttack] += 1

                                # Append truncated line to the textual data list.
                                self.text_data.append(truncated_line)

                                # Print prediction details when debugging is enabled.
                                if debug:
                                    print("Predicted class:", predicted_class)
                                    print("Predicted class is: ", self.classes[predicted_class])
                                    print("Class probabilities:", probabilities.tolist())

    def generate_graph(self, data, title, graph_color, xtext, ytext):
        plt.figure(figsize=(12, 8))  # Increase the figure size for better visibility
        plt.bar(data.keys(), data.values(), color=graph_color, width=0.7)
        plt.xlabel(xtext, weight='bold')
        plt.xticks(rotation=45, ha='right')
        plt.ylabel(ytext, weight='bold')
        plt.title(title)

        img_bytes = BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)

        # Convert the image to base64 encoding
        encoded_image = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
        plt.close()

        return encoded_image

    def create_network_graph(self):
        packets = rdpcap(self.file_path)
        G = nx.DiGraph()
        for packet in packets:
            if packet.haslayer(IP):
                src_ip = packet[IP].src
                dst_ip = packet[IP].dst
                G.add_edge(src_ip, dst_ip)
        return G

    def visualize_network_graph(self):
        network_graph = self.create_network_graph()

        pos = nx.spring_layout(network_graph)
        nx.draw(network_graph, pos, with_labels=True, font_size=8, node_size=1000, node_color='skyblue', font_color='black', font_weight='bold')
        #plt.show()

        img_bytes = BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)

        encoded_image = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
        plt.close()

        return encoded_image

    def visualize_destination_ports_plot(self, top_n=20):
        packets = rdpcap(self.file_path)

        destination_ports = {}

        for packet in packets:
            if IP in packet and TCP in packet:
                dst_ip = packet[IP].dst
                dst_port = packet[TCP].dport
                destination_ports[(dst_ip, dst_port)] = destination_ports.get((dst_ip, dst_port), 0) + 1
        sorted_ports = sorted(destination_ports.items(), key=lambda x: x[1], reverse=True)

        plt.figure(figsize=(10, 6))

        top_ports = sorted_ports[:top_n]

        destinations, counts = zip(*top_ports)
        dst_labels = [f"{ip}:{port}" for (ip, port) in destinations]

        plt.bar(dst_labels, counts, color='skyblue')
        plt.xlabel('Destination IP and TCP Ports')
        plt.ylabel('Count')
        plt.title(f'Top {top_n} Most Contacted TCP Ports')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()

        img_bytes = BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)

        encoded_image = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
        plt.close()

        return encoded_image


    def get_graph_results(self):
        try:
            self.packets_brief.clear()

            if len(self.filter) > 0:
                self.predictingRowsCategoryOnGPU(self.file_path, self.filter.encode('utf-8'), False) # Will take care of saving data in packets_brief
            else:
                self.predictingRowsCategoryOnGPU(self.file_path, b"", False) # Will take care of saving data in packets_brief

            # Generate first graph
            keys1 = list(self.packets_brief.keys())
            vals1 = list(self.packets_brief.values())
            graph1 = self.generate_graph(dict(zip(keys1, vals1)), 'Identified Known Attacks​', '#ef6666', "Attacks", "Number of Malicious Packets")

            # Generate Second graph
            keys2 = list(self.protocol_counts.keys())
            vals2 = list(self.protocol_counts.values())
            graph2 = self.generate_graph(dict(zip(keys2, vals2)), 'Identified Protocols​', '#341f97', "Protocols", "Number of Packets")

            # Generate Third graph
            graphh3 = self.visualize_network_graph()
            # Generate Third graph

            graphh3 = self.visualize_network_graph()

            # Generate Fourth graph

            graph4 = self.visualize_destination_ports_plot() # type: ignore

            if len(self.packets_brief) == 0:
                return {"graphs": {"graph1": graph1, "graph2": graph2, "graph3": graphh3, "graph4": graph4}, "alert_text": f"{self.file_name} is clean.", "alert_color": "text-green-500"}
            else:
                return {"graphs": {"graph1": graph1, "graph2": graph2, "graph3": graphh3, "graph4": graph4}, "alert_text": f"{self.file_name} contains malicious packets.", "alert_color": "text-red-500"}
        except Exception as e:
            return {'error': str(e)}