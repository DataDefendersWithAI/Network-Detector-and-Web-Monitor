from django.urls import path
from . import views 

urlpatterns = [
    path('api/pcap-analysis/', views.PcapAnalysisView.as_view()),
]