from transformers import AutoTokenizer, AutoModelForSequenceClassification
import matplotlib.pyplot as plt
from scapy.all import rdpcap
from scapy.all import *
from io import BytesIO
import networkx as nx
import threading
import torch
import os

PCAP_TRAFFIC_ANALYSIS_FOLDER = "pcap_files/traffic_analysis"

class TrafficAnalysis:
    def __init__(self, file_path = None, filter = None, debug = False):
        # Initialize an empty list to store textual data.
        self.file_path = file_path
        self.file_name = None
        self.filter = filter
        self.debug = debug
        self.text_data = []
        self.packets_brief = {}
        self.protocols = []
        self.protocol_counts = {}
        self.lock = threading.Lock()
        self.running = False
        self.runned = False
        self.graphs = {
            "graph1": "",
            "graph2": "",
            "graph3": "",
            "graph4": ""
        }
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
        plt.xticks(rotation=15, ha='right')
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

        plt.figure(figsize=(12, 8))  # Set the figure size to 12:8 ratio
        pos = nx.spring_layout(network_graph)
        nx.draw(network_graph, pos, with_labels=True, font_size=8, node_size=1000, node_color='skyblue', font_color='black', font_weight='bold')

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

        plt.figure(figsize=(12, 8))

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


    def get_graph_results(self, run_analysis=True):
        try:
            with self.lock:
                if run_analysis:
                    self.packets_brief.clear()
                    self.running = True

                    if len(self.filter) > 0:
                        self.predictingRowsCategoryOnGPU(self.file_path, self.filter.encode('utf-8'), False) # Will take care of saving data in packets_brief
                    else:
                        self.predictingRowsCategoryOnGPU(self.file_path, b"", False) # Will take care of saving data in packets_brief

                    # Generate first graph
                    keys1 = list(self.packets_brief.keys())
                    vals1 = list(self.packets_brief.values())
                    self.graph1 = self.generate_graph(dict(zip(keys1, vals1)), 'Identified Known Attacks​', '#ef6666', "Attacks", "Number of Malicious Packets")

                    # Generate Second graph
                    keys2 = list(self.protocol_counts.keys())
                    vals2 = list(self.protocol_counts.values())
                    self.graph2 = self.generate_graph(dict(zip(keys2, vals2)), 'Identified Protocols​', '#341f97', "Protocols", "Number of Packets")

                    # Generate Third graph
                    self.graph3 = self.visualize_network_graph()

                    # Generate Fourth graph
                    self.graph4 = self.visualize_destination_ports_plot() # type: ignore

                    # Ensure the graphs are stored in memory
                    self.graphs = {
                        "graph1": self.graph1,
                        "graph2": self.graph2,
                        "graph3": self.graph3,
                        "graph4": self.graph4
                    }

                    self.running = False
                    self.runned = True
    
            if len(self.packets_brief) == 0 and self.running == False and self.runned == True:
                return {"graphs": self.graphs, 
                        "status": "clean", 
                        "alert_text": "No malicious traffic detected.",
                        "file_name": self.file_name}
            elif len(self.packets_brief) > 0 and self.running == False and self.runned == True:
                return {"graphs": self.graphs, 
                        "status":"suspicious", 
                        "alert_text": "Potential malicious traffic detected.",
                        "file_name": self.file_name}
            elif self.running == True:
                return {"graphs": self.graphs, 
                        "status": "analyzing", 
                        "alert_text": "Analyzing traffic...",
                        "file_name": self.file_name}
            # return blank graphs if nothing
            else:
                return {"graphs": self.graphs, 
                        "status": "idle", 
                        "alert_text": "",
                        "file_name": self.file_name}

        except Exception as e:
            return {"error": str(e)}