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
current_timezone = pytz.timezone("Asia/Ho_Chi_Minh")


def get_times(ans):
    for pack in ans:
        yield pack[1].time - pack[0].sent_time


def icmp_scan(ip):
    conf.verb=0
    dest = ip
    num_packets = 10
    p = IP(dst=dest, ttl=50)/ICMP()
    is_active = sr1(p, timeout=2, verbose=0)
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
    permission_classes = (AllowAny,)
    def post(self, request):
        ip = request.data.get('ip')
        if ip is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            icmp_scan(ip)
            detail_ip = ICMPdatabase.objects.get(ip_address=ip)
            serializer = ICMPdatabaseSerializer(detail_ip)
            return Response(serializer, status=status.HTTP_200_OK)
    
class ICMPList(APIView):
    permission_classes = (AllowAny,)
    def get(self, request):
        ip = ICMPdatabase.objects.all()
        for i in ip:
            icmp_scan(i.ip_address)
        new_ip = ICMPdatabase.objects.all()
        serializer = ICMPdatabaseSerializer(new_ip, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ICMPDetail(APIView):
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
