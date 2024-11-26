from django.urls import path
from . import views

urlpatterns = [

    path('api/icmp_scan', views.ICMPScan.as_view(), name='icmp-scan'),
    path('api/icmp_list', views.ICMPList.as_view(), name='icmp-list'),
    path('api/icmp_detail/<int:pk>', views.ICMPDetail.as_view(), name='icmp-detail'),
]