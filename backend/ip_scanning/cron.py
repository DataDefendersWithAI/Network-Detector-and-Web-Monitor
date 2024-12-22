from scapy.all import *
from scapy.all import srp, Ether, ARP
from .models import IPdatabase, HostDatabase, IPEvent
import requests
import datetime
from scapy.layers.inet import IP, ICMP
import socket
import pytz
import getmac
import nmap 
current_timezone = pytz.timezone("Asia/Ho_Chi_Minh")
# Create your views here.

def detect_device(vendor, mac):
    this_mac = mac.upper()
    this_vendor = vendor.lower()
    if any(brand in this_vendor for brand in {"samsung", "motorola"}):
        result = "Phone"
    elif "cisco" in this_vendor:
        result = "Router"
    elif "tenda" in this_vendor:
        result = "Router"
    elif "lg" in this_vendor:
        result = "TV"
    elif "google" in this_vendor:
        result = "Phone"
    elif "ubiquiti" in this_vendor:
        result = "Router" 
    elif "dell" in this_vendor:
        result = "Laptop"
    elif "hp" in this_vendor:
        result = "Printer"
    elif "cisco" in this_vendor:
        result = "Router"
    elif "lg" in this_vendor:
        result = "TV"
    elif "raspberry" in this_vendor:
        result = "Raspberry Pi"
    elif "apple" in this_vendor:
        result = "iPhone"
    elif "google" in this_vendor:
        result = "Google Home"
    elif "ubiquiti" in this_vendor:
        result = "Router"
    elif any(brand in this_vendor for brand in {"espressif"}):
        result = "microchip"
    elif this_mac.startswith("00:1A:79"):
        result = "Apple"
    elif this_mac.startswith("B0:BE:83"):
        result = "Apple"
    elif this_mac.startswith("00:1B:63"):
        result = "tablet"
    elif this_mac.startswith("74:AC:B9"):
        result = "ethernet"
    else:
        result = "Unknown"
    return result

def os_detection(ip):
    nm = nmap.PortScanner()
    result = ""
    scan_result = nm.scan(hosts=ip, arguments="-Pn -T4 --min-rate 3000 -O --osscan-guess")
    try:
        result = scan_result["scan"][ip]['osmatch'][0]['osclass'][0]['osfamily']
        return result
    except Exception as e:
        print("OS detection error: ", e)
        packet = IP(dst=ip) / ICMP()
        response = sr1(packet, timeout = 2, verbose = False)
        if response:
            if IP in response:
                ttl = response.getlayer(IP).ttl
                if ttl == 64:
                    result = "Linux"
                elif ttl == 128:
                    result = "Windows"
                elif ttl == 190 or ttl == 127:
                    result = "MacOS"
                else:
                    result = "Unknown"
        else:
            result = "Unknown"
        return result

def full_scan_port_detection(ip, update=False):
    result_ports = ""
    nm = nmap.PortScanner()
    nm.scan(hosts=ip, arguments="-Pn -T4 --min-rate 3000 -p-")
    try:
        for protocol in nm[ip].all_protocols():
            port_info = nm[ip][protocol]
            for port, state in port_info.items():
                if state['state'] == 'open':
                    result_ports += str(port) + ', '
        if result_ports == "":
            return "No open ports"
        if update==True:
            ip = IPdatabase.objects.get(ip_address=ip)
            ip.open_ports = result_ports.rstrip(', ')
            ip.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
            ip.save()
        return result_ports.rstrip(', ')
    except Exception as e:
        print("Port detection error: ", e)
        return "No open ports"

def fast_scan_port_detection(ip, update=False):
    result_ports = ""
    nm = nmap.PortScanner()
    nm.scan(hosts=ip, arguments="-Pn -T4 --min-rate 3000 -F")
    try:
        for protocol in nm[ip].all_protocols():
            port_info = nm[ip][protocol]
            for port, state in port_info.items():
                if state['state'] == 'open':
                    result_ports += str(port) + ', '
        if result_ports == "":
            return "No open ports"
        if update==True:
            ip = IPdatabase.objects.get(ip_address=ip)
            ip.open_ports = result_ports.rstrip(', ')
            ip.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
            ip.save()
        return result_ports.rstrip(', ')
    except Exception as e:
        print("Port detection error: ", e)
        return "No open ports"

def port_detection(ip, update=False):
    result_ports = ""
    list_ports = ['80', '23', '443', '21', '22', '25', '3389', '110', '445', '139', '143', '53', '135', '3306', '8080', '1723', '111', '995', '993', '5900', '1025', '587', '8888', '199', '1720', '465', '548', '113', '81', '6001', '10000', '514', '5060', '179', '1026', '2000', '8443', '8000', '32768', '554', '26', '1433', '49152', '2001', '515', '8008', '49154', '1027', '5666', '646', '5000', '5631', '631', '49153', '8081', '2049', '88', '79', '5800', '106', '2121', '1110', '49155', '6000', '513', '990', '5357', '427', '49156', '543', '544', '5101', '144', '7', '389', '8009', '3128', '444', '9999', '5009', '7070', '5190', '3000', '5432', '1900', '3986', '13', '1029', '9', '5051', '6646', '49157', '1028', '873', '1755', '2717', '4899', '9100', '119', '37', '1000', '3001', '5001', '82', '10010', '1030', '9090', '2107', '1024', '2103', '6004', '1801', '5050', '19', '8031', '1041', '255', '1049', '1048', '2967', '1053', '3703', '1056', '1065', '1064', '1054', '17', '808', '3689', '1031', '1044', '1071', '5901', '100', '9102', '8010', '2869', '1039', '5120', '4001', '9000', '2105', '636', '1038', '2601', '1', '7000', '1066', '1069', '625', '311', '280', '254', '4000', '1993', '1761', '5003', '2002', '2005', '1998', '1032', '1050', '6112', '3690', '1521', '2161', '6002', '1080', '2401', '4045', '902', '7937', '787', '1058', '2383', '32771', '1033', '1040', '1059', '50000', '5555', '10001', '1494', '593', '2301', '3', '1', '3268', '7938', '1234', '1022', '1074', '8002', '1036', '1035', '9001', '1037', '464', '497', '1935', '6666', '2003', '6543', '1352', '24', '3269', '1111', '407', '500', '20', '2006', '3260', '15000', '1218', '1034', '4444', '264', '2004', '33', '1042', '42510', '999', '3052', '1023', '1068', '222', '7100', '888', '4827', '1999', '563', '1717', '2008', '992', '32770', '32772', '7001', '8082', '2007', '740', '5550', '2009', '5801', '1043', '512', '2701', '7019', '50001', '1700', '4662', '2065', '2010', '42', '9535', '2602', '3333', '161', '5100', '5002', '2604', '4002', '6059', '1047', '8192', '8193', '2702', '6789', '9595', '1051', '9594', '9593', '16993', '16992', '5226', '5225', '32769', '3283', '1052', '8194', '1055', '1062', '9415', '8701', '8652', '8651', '8089', '65389', '65000', '64680', '64623', '55600', '55555', '52869', '35500', '33354', '23502', '20828', '1311', '1060', '4443', '730', '731', '709', '1067', '13782', '5902', '366', '9050', '1002', '85', '5500', '5431', '1864', '1863', '8085', '51103', '49999', '45100', '10243', '49', '3495', '6667', '90', '475', '27000', '1503', '6881', '1500', '8021', '340', '78', '5566', '8088', '2222', '9071', '8899', '6005', '9876', '1501', '5102', '32774', '32773', '9101', '5679', '163', '648', '146', '1666', '901', '83', '9207', '8001', '8083', '5004', '3476', '8084', '5214', '14238', '12345', '912', '30', '2605', '2030', '6', '541', '8007', '3005', '4', '1248', '2500', '880', '306', '4242', '1097', '9009', '2525', '1086', '1088', '8291', '52822', '6101', '900', '7200', '2809', '395', '800', '32775', '12000', '1083', '211', '987', '705', '20005', '711', '13783', '6969', '3071', '5269', '5222', '1085', '1046', '5987', '5989', '5988', '2190', '11967', '8600', '3766', '7627', '8087', '30000', '9010', '7741', '14000', '3367', '1099', '1098', '3031', '2718', '6580', '15002', '4129', '6901', '3827', '3580', '2144', '9900', '8181', '3801', '1718', '2811', '9080', '2135', '1045', '2399', '3017', '10002', '1148', '9002', '8873', '2875', '9011', '5718', '8086', '3998', '2607', '11110', '4126', '5911', '5910', '9618', '2381', '1096', '3300', '3351', '1073', '8333', '3784', '5633', '15660', '6123', '3211', '1078', '3659', '3551', '2260', '2160', '2100', '16001', '3325', '3323', '1104', '9968', '9503', '9502', '9485', '9290', '9220', '8994', '8649', '8222', '7911', '7625', '7106', '65129', '63331', '6156', '6129', '60020', '5962', '5961', '5960', '5959', '5925', '5877', '5825', '5810', '58080', '57294', '50800', '50006', '50003', '49160', '49159', '49158', '48080', '40193', '34573', '34572', '34571', '3404', '33899', '3301', '32782', '32781', '31038', '30718', '28201', '27715', '25734', '24800', '22939', '21571', '20221', '20031', '19842', '19801', '19101', '17988', '1783', '16018', '16016', '15003', '14442', '13456', '10629', '10628', '10626', '10621', '10617', '10616', '10566', '10025', '10024', '10012', '1169', '5030', '5414', '1057', '6788', '1947', '1094', '1075', '1108', '4003', '1081', '1093', '4449', '1687', '1840', '1100', '1063', '1061', '1107', '1106', '9500', '20222', '7778', '1077', '1310', '2119', '2492', '1070', '20000', '8400', '1272', '6389', '7777', '1072', '1079', '1082', '8402', '89', '691', '1001', '32776', '1999', '212', '2020', '6003', '7002', '2998', '50002', '3372', '898', '5510', '32', '2033', '4165', '3061', '5903', '99', '749', '425', '43', '5405', '6106', '13722', '6502', '7007', '458', '9666', '8100', '3737', '5298', '1152', '8090', '2191', '3011', '1580', '5200', '3851', '3371', '3370', '3369', '7402', '5054', '3918', '3077', '7443', '3493', '3828', '1186', '2179', '1183', '19315', '19283', '3995', '5963', '1124', '8500', '1089', '10004', '2251', '1087', '5280', '3871', '3030', '62078', '9091', '4111', '1334', '3261', '2522', '5859', '1247', '9944', '9943', '9877', '9110', '8654', '8254', '8180', '8011', '7512', '7435', '7103', '61900', '61532', '5922', '5915', '5904', '5822', '56738', '55055', '51493', '50636', '50389', '49175', '49165', '49163', '3546', '32784', '27355', '27353', '27352', '24444', '19780', '18988', '16012', '15742', '10778', '4006', '2126', '4446', '3880', '1782', '1296', '9998', '9040', '32779', '1021', '32777', '2021', '32778', '616', '666', '700', '5802', '4321', '545', '1524', '1112', '49400', '84', '38292', '2040', '32780', '3006', '2111', '1084', '1600', '2048', '2638', '6699', '9111', '16080', '6547', '6007', '1533', '5560', '2106', '1443', '667', '720', '2034', '555', '801', '6025', '3221', '3826', '9200', '2608', '4279', '7025', '11111', '3527', '1151', '8200', '8300', '6689', '9878', '10009', '8800', '5730', '2394', '2393', '2725', '5061', '6566', '9081', '5678', '3800', '4550', '5080', '1201', '3168', '3814', '1862', '1114', '6510', '3905', '8383', '3914', '3971', '3809', '5033', '7676', '3517', '4900', '3869', '9418', '2909', '3878', '8042', '1091', '1090', '3920', '6567', '1138', '3945', '1175', '10003', '3390', '3889', '1131', '8292', '5087', '1119', '1117', '4848', '7800', '16000', '3324', '3322', '5221', '4445', '9917', '9575', '9099', '9003', '8290', '8099', '8093', '8045', '7921', '7920', '7496', '6839', '6792', '6779', '6692', '6565', '60443', '5952', '5950', '5907', '5906', '5862', '5850', '5815', '5811', '57797', '56737', '5544', '55056', '5440', '54328', '54045', '52848', '52673', '50500', '50300', '49176', '49167', '49161', '44501', '44176', '41511', '40911', '32785', '32783', '30951', '27356', '26214', '25735', '19350', '18101', '18040', '17877', '16113', '15004', '14441', '12265', '12174', '10215', '10180', '4567', '6100', '4004', '4005', '8022', '9898', '7999', '1271', '1199', '3003', '1122', '2323', '4224', '2022', '617', '777', '417', '714', '6346', '981', '722', '1009', '4998', '70', '1076', '5999', '10082', '765', '301', '524', '668', '2041', '6009', '1417', '1434', '259', '44443', '1984', '2068', '7004', '1007', '4343', '416', '2038', '6006', '109', '4125', '1461', '9103', '911', '726', '1010', '2046', '2035', '7201', '687', '2013', '481', '125', '6669', '6668', '903', '1455', '683', '1011', '2043', '2047', '31337', '256', '9929', '5998', '406', '44442', '783', '843', '2042', '2045', '4040', '6060', '6051', '1145', '3916', '9443', '9444', '1875', '7272', '4252', '4200', '7024', '1556', '13724', '1141', '1233', '8765', '1137', '3963', '5938', '9191', '3808', '8686', '3981', '2710', '3852', '3849', '3944', '3853', '9988', '1163', '4164', '3820', '6481', '3731', '5081', '40000', '8097', '4555', '3863', '1287', '4430', '7744', '1812', '7913', '1166', '1164', '1165', '8019', '10160', '4658', '7878', '3304', '3307', '1259', '1092']
    list_ports = ','.join(str(port) for port in list_ports)
    nm = nmap.PortScanner()
    nm.scan(hosts=ip, ports=list_ports, arguments="-Pn -T4 --min-rate 3000")
    try:
        for protocol in nm[ip].all_protocols():
            port_info = nm[ip][protocol]
            for port, state in port_info.items():
                if state['state'] == 'open':
                    result_ports += str(port) + ', '
        if result_ports == "":
            return "No open ports"
        if update==True:
            ip = IPdatabase.objects.get(ip_address=ip)
            ip.open_ports = result_ports.rstrip(', ')
            ip.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
            ip.save()
        return result_ports.rstrip(', ')
    except Exception as e:
        print("Port detection error: ", e)
        return "No open ports"
    
def my_ip_and_mac():
    google_dns = "8.8.8.8"
    port = 80
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect((google_dns, port))
    ip_address = s.getsockname()[0]
    mac_address = getmac.get_mac_address()
    return ip_address, mac_address

def real_time_scan(ip, mac, url_vendor):
    device_info, created = IPdatabase.objects.get_or_create(mac_address=mac)
    if created == False:
        if device_info.device == "Unknown":
            device_info.device = detect_device(device_info.vendor, device_info.mac_address)
        if device_info.os == "Unknown":
            device_info.os = os_detection(device_info.ip_address)
        if device_info.open_ports == "No open ports":
            device_info.open_ports = port_detection(device_info.ip_address)
        device_info.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
        if device_info.ip_address != ip:
            device_info.events.create(
                ip_address=device_info.ip_address,
                event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                is_active=True,
                additional_info=f"IP changed to {ip}"
            )
            device_info.ip_address = ip
        if device_info.is_active == False:
            device_info.events.create(
                ip_address=device_info.ip_address,
                event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                is_active=True,
                additional_info="Device is reconnected to the network"
            )
        else:
            device_info.events.create(
                ip_address=device_info.ip_address,
                event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                is_active=True,
                additional_info="Device is still connected to the network"
            )
        device_info.is_active = True
        device_info.save()
    else:
        device_info.ip_address = ip
        device_info.mac_address = mac
        # get the vendor information
        response = requests.get(url_vendor + mac)
        if response.status_code == 200:
            device_info.vendor = response.content.decode()
        else:
            device_info.vendor = "Unknown"
        device_info.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
        device_info.device = detect_device(device_info.vendor, device_info.mac_address)
        device_info.os = os_detection(device_info.ip_address)
        device_info.open_ports = port_detection(device_info.ip_address)
        device_info.is_active = True
        device_info.events.create(
            ip_address=device_info.ip_address,
            event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
            is_active=True,
            additional_info="New device is connected to the network"
        )
        device_info.save()
    

def nmap_scan():
    new_host = HostDatabase.objects.first()
    if new_host == None:
        new_host = "192.168.1.0/24"
    else:
        new_host = new_host.host
    nm = nmap.PortScanner()
    result = nm.scan(hosts=new_host, arguments="-sn -T4 --min-rate 3000")
    connected_ip = []
    my_ip, my_mac = my_ip_and_mac()
    connected_ip.append(my_ip)
    real_time_scan(my_ip, my_mac, url_vendor="https://api.macvendors.com/")
    for host in nm.all_hosts():
        if nm[host].state() == "up" and "mac" in nm[host]["addresses"]:
            connected_ip.append(host)
            print("Connected host: ", host)
            real_time_scan(host, nm[host]["addresses"]["mac"].lower(), url_vendor="https://api.macvendors.com/")
    for ip in IPdatabase.objects.all():
        if ip.ip_address not in connected_ip:
            print(ip.ip_address)
            if ip.is_active == True:
                ip.events.create(
                    ip_address=ip.ip_address,
                    event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                    is_active=False,
                    additional_info="Device is disconnected from the network"
                )
            else:
                ip.events.create(
                    ip_address=ip.ip_address,
                    event_date=datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S"),
                    is_active=False,
                    additional_info="Device is still disconnected from the network"
                )
            ip.is_active = False
            ip.scan_date = datetime.datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
            ip.save()


def update_host(new_host):
    host = HostDatabase.objects.first()
    if host == None:
        HostDatabase.objects.create(host=new_host)
    else:
        host.host = new_host
        host.save()

# def scan_ip():
#     new_host = HostDatabase.objects.first()
#     if new_host == None:
#         new_host = "192.168.1.0/24"
#     else:
#         new_host = new_host.host
#     arp_request = ARP(pdst=new_host)
#     broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
#     arp_request_broadcast = broadcast / arp_request
#     # send and recieve the ARP requests 
#     answered_list = srp(arp_request_broadcast, timeout=3, verbose=False)[0]
#     # and then extract device information from responses
#     connected_ip = []
#     url_vendor = "https://api.macvendors.com/"
#     my_ip, my_mac = my_ip_and_mac()
#     connected_ip.append(my_ip)
#     real_time_scan(my_ip, my_mac, url_vendor=url_vendor)
#     for element in answered_list:
#         connected_ip.append(element[1].psrc)
#         real_time_scan(element[1].psrc, element[1].hwsrc, url_vendor= url_vendor)