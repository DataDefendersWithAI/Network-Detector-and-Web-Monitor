from rest_framework.response import Response
from django.http import FileResponse
from django.utils import timezone

from rest_framework.views import APIView
import os

# Return system avgload, memusage(%), and cputemp (thermal_zone2)
class SystemView(APIView):
    def get(self, request):
        try:
            avgload = os.popen('cat /proc/loadavg').read().split(' ')[:3]
            avgload = f"{avgload[0]} {avgload[1]} {avgload[2]}"
        except:
            avgload = "0.00 0.00 0.00"
        try:
            memusage = os.popen(r"free | grep Mem | awk '{print $3/$2 * 100.0}'").read().strip()
            memusage = "{:.2f}".format(float(memusage))
        except:
            memusage = 0
        try:
            cputemp = int(os.popen('cat /sys/class/thermal/thermal_zone2/temp').read()) / 1000
        except:
            cputemp = 0
        return Response({
            'avgload': avgload,
            'memusage': memusage,
            'cputemp': cputemp
        })
