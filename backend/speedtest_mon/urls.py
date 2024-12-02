from . import views 
from django.urls import path

urlpatterns = [
    path('api/speedtest/', views.SpeedTestView.as_view(), name='speed-test'),
    path('api/speedtest-history/', views.SpeedTestHistoryView.as_view(), name='speed-test-history'),
]