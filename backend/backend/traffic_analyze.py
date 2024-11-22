from scapy.all import *

def packet_find(pcap_file, filter=None):
    pkts = rdpcap(pcap_file) 
    pkts_dict = {}
    # add package id to each packet
    if filter == None or filter == "":
        for i, pkt in enumerate(pkts):
            pkts_dict[i + 1] = pkt
        return pkts_dict
    pkts_filtered = sniff(offline=pkts, filter=filter)
    # add package id to each packet base on the whole pcap file
    for i, pkt in enumerate(pkts_filtered):
        pkts_dict[pkts.index(pkt) + 1] = pkt
    return pkts_dict

def summary_packets(filtered_packets, packet_number=None):
    if packet_number == None or packet_number == "":
        return {k: v.summary() for k, v in filtered_packets.items()}
    filtered_packets = filtered_packets[packet_number]
    return filtered_packets.summary()

def show_packets(filtered_packets, packet_number=None):
    if packet_number == None or packet_number == "":
        return {k: v.show(dump=True) for k, v in filtered_packets.items()}
    filtered_packets = filtered_packets[packet_number]
    return filtered_packets.show(dump=True)

if __name__ == "__main__":
    packets = packet_find("./test.pcap","")
    print(packets)