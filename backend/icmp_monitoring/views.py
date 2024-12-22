from django.shortcuts import render
from icmp_monitoring.models import ICMPdatabase
from scapy.all import sr,IP,ICMP,conf, sr1
from datetime import datetime, time
import pytz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from icmp_monitoring.serializers import ICMPdatabaseSerializer
# Create your views here.
# Read timezone from settings.py
from django.conf import settings
current_timezone = pytz.timezone(settings.TIME_ZONE)

def get_times(ans):
    """
    This function calculates the round-trip time for each packet in the response.
    """
    for pack in ans:
        yield pack[1].time - pack[0].sent_time


def icmp_scan(ip):
    """
    This function scans the IP address using ICMP and saves the results to the database.
    If the IP address is active, it sends 10 packets and calculates the average, minimum, and maximum round-trip time.
    If the IP address is not active, it sets the average, minimum, and maximum round-trip time to 0 and is_active to False.

    Parameters:
    ip (str): The IP address to scan.

    Returns:
    None
    """
    conf.verb=0
    dest = ip
    num_packets = 10
    p = IP(dst=dest, ttl=50)/ICMP()
    is_active = sr1(p, timeout=2, verbose=0)
    # If the IP address is active, send 10 packets and calculate the average, minimum, and maximum round-trip time
    if is_active is not None:
        ans, unans = sr(p*num_packets, timeout=2, verbose=0)
        l = list(get_times(ans))
        avg_time = sum(l)/len(l)
        min_time = min(l)
        max_time = max(l)
        ip_info, created = ICMPdatabase.objects.get_or_create(ip_address=dest)
        if created == True:
            ip_info.ip_address = dest
        ip_info.scan_date = datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
        ip_info.avg_rtt = avg_time*1000
        ip_info.min_rtt = min_time*1000
        ip_info.max_rtt = max_time*1000
        ip_info.is_active = True
        ip_info.save()
    # If the IP address is not active, set the average, minimum, and maximum round-trip time to 0 and is_active to False
    else:
        ip_info, created = ICMPdatabase.objects.get_or_create(ip_address=dest)
        if created == True:
            ip_info.ip_address = dest
        ip_info.scan_date = datetime.now(current_timezone).strftime("%Y-%m-%d %H:%M:%S")
        ip_info.avg_rtt = 0
        ip_info.min_rtt = 0
        ip_info.max_rtt = 0
        ip_info.is_active = False
        ip_info.save()

class ICMPScan(APIView):
    """
    This class-based view handles the ICMP scan request.

    Attributes:
    permission_classes (tuple): A tuple containing the permission classes that the view requires.

    Methods:
    post: This method handles the POST request to scan an IP address using ICMP. It sends 10 packets to the IP address and calculates the average, minimum, and maximum round-trip time. It saves the results to the database and returns the response. If the IP address is not provided in the request, it returns a 400 Bad Request response.
    """
    permission_classes = (AllowAny,)
    def post(self, request):
        ip = request.data.get('ip')
        if ip is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            icmp_scan(ip)
            detail_ip = ICMPdatabase.objects.get(ip_address=ip)
            serializer = ICMPdatabaseSerializer(detail_ip)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
class ICMPList(APIView):
    """
    This class-based view handles the ICMP list request.

    Attributes:
    permission_classes (tuple): A tuple containing the permission classes that the view requires.

    Methods:
    get: This method handles the GET request to scan all IP addresses in the database using ICMP. It sends 10 packets to each IP address and calculates the average, minimum, and maximum round-trip time. It saves the results to the database and returns the response.
    """
    permission_classes = (AllowAny,)
    def get(self, request):
        ip = ICMPdatabase.objects.all()
        for i in ip:
            icmp_scan(i.ip_address)
        new_ip = ICMPdatabase.objects.all()
        serializer = ICMPdatabaseSerializer(new_ip, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ICMPDetail(APIView):
    """
    This class-based view handles the ICMP detail request.

    Attributes:
    permission_classes (tuple): A tuple containing the permission classes that the view requires.

    Methods:
    get: This method handles the GET request to get the details of an IP address in the database. It returns the response with the IP address details.
    post: This method handles the POST request to update the details of an IP address in the database. It updates the IP address details and returns the response. If the IP address is not found in the database, it returns a 404 Not Found response.
    delete: This method handles the DELETE request to delete an IP address from the database. It deletes the IP address and returns the response. If the IP address is not found in the database, it returns a 404 Not Found response.
    """
    permission_classes = (AllowAny,)
    def get(self, request, pk):
        
        try:
            ip = ICMPdatabase.objects.get(id=pk)
        except ICMPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        icmp_scan(ip.ip_address)
        serializer = ICMPdatabaseSerializer(ip)
        return Response(serializer.data)
    def post(self, request, pk):
        try:
            ip = ICMPdatabase.objects.get(id=pk)
        except ICMPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ICMPdatabaseSerializer(ip, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else: return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            ip = ICMPdatabase.objects.get(id=pk)
        except ICMPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ip.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
