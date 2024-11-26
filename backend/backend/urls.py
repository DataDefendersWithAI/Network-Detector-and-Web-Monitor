"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import DeviceListView, DeviceDetailView
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('/', DeviceListView.as_view(), name='device-list'),
    path('api/devices/', DeviceListView.as_view(), name='device-list'),
    path('api/devices/<str:mac>/', DeviceDetailView.as_view(), name='device-detail'),
    path('api/web-monitor/', views.WebsiteMonitorView.as_view(), name='website-monitor'),
    path('api/speedtest/', views.SpeedTestView.as_view(), name='speed-test'),
    path('api/add-website/', views.AddWebsiteView.as_view(), name='add-website'),
    path('api/view-pcap/', views.PcapOpenView.as_view(), name='view-pcap'),
    path('api/capture-packets/', views.PcapCaptureView.as_view(), name='capture-packets'),
    path('api/interfaces/', views.NetworkInterfacesView.as_view(), name='interfaces'),
    path('api/pcap-analysis/', views.PcapAnalysisView.as_view(), name='pcap-analysis'),
    path('', include('icmp_monitoring.urls')),
    path('', include('ip_scanning.urls'))
]
