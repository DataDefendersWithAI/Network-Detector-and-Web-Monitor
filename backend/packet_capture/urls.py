from django.urls import path
from . import views 

urlpatterns = [
    path('api/view-pcap/', views.PcapOpenView.as_view(), name='view-pcap'),
    path('api/list-pcap/', views.PcapListView.as_view(), name='list-pcap'),
    path('api/upload-pcap/', views.PcapUploadView.as_view(), name='upload-pcap'),
    path('api/delete-pcap/', views.PcapDeleteView.as_view(), name='delete-pcap'),
    path('api/capture-packets/', views.PcapCaptureView.as_view(), name='capture-packets'),
    path('api/interfaces/', views.NetworkInterfacesView.as_view(), name='interfaces')
]