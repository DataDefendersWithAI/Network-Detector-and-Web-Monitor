from scapy.all import ARP, Ether, srp

def scan_network(network_range):
    # Create ARP request
    arp_request = ARP(pdst=network_range)
    # Create Ethernet broadcast frame
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    # Combine Ethernet frame and ARP request
    arp_request_broadcast = broadcast / arp_request
    # Send packet and capture the responses
    answered_list = srp(arp_request_broadcast, timeout=2, verbose=False)[0]
    
    # Extract IP addresses from the responses
    devices = []
    for sent, received in answered_list:
        devices.append({'ip': received.psrc, 'mac': received.hwsrc})
    
    return devices

# Example: Scan the 192.168.1.x range
network_range = "10.0.232.203/16"
devices = scan_network(network_range)

# Output all detected IPs
print("Devices found:")
for device in devices:
    print(f"IP: {device['ip']} - MAC: {device['mac']}")
