from django.shortcuts import render
from django.http import HttpResponse
from .models import IPdatabase
from .cron import *
from .serializers import IPdatabaseSerializer, IPEventSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from datetime import datetime

class IPList(APIView):
   
    def get(self, request):
        nmap_scan()
        ip = IPdatabase.objects.all()
        serializer = IPdatabaseSerializer(ip, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class IPDetail(APIView):
   
    def get(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IPdatabaseSerializer(ip)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IPdatabaseSerializer(ip, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else: return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ip.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class IPEventDetail(APIView):
   
    def get(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        events = ip.events.all()
        serializers = IPEventSerializer(events, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class CreateIP(APIView):
   
    def post(self, request):
        serializer = IPdatabaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(scan_date=datetime.now())
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangeHost(APIView):
   
    def post(self, request):
        new_host = request.data.get("host")
        if new_host:
            update_host(new_host)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

class FastScanIP(APIView):
   
    def get(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        fast_scan_port_detection(ip.ip_address, True)
        new_ip = IPdatabase.objects.get(id=pk)
        ip_serializer = IPdatabaseSerializer(new_ip)
        return Response(ip_serializer.data,status=status.HTTP_200_OK)

class FullScanIP(APIView):
   
    def get(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        full_scan_port_detection(ip.ip_address, True)
        new_ip = IPdatabase.objects.get(id=pk)
        ip_serializer = IPdatabaseSerializer(new_ip)
        return Response(ip_serializer.data,status=status.HTTP_200_OK)

class DefaultScanIP(APIView):
   
    def get(self, request, pk):
        try:
            ip = IPdatabase.objects.get(id=pk)
        except IPdatabase.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        port_detection(ip.ip_address, True)
        new_ip = IPdatabase.objects.get(id=pk)
        ip_serializer = IPdatabaseSerializer(new_ip)
        return Response(ip_serializer.data,status=status.HTTP_200_OK)





        
    
    
