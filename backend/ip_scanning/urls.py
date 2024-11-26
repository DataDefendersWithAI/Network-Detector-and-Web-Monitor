from django.urls import path
from . import views

# Define the URL patterns for the ip_scanning app

urlpatterns = [
    path('api/ip/', views.IPList.as_view(), name='list-all-IPs'),
    path('api/ip/create', views.CreateIP.as_view(), name='create-IP'),
    path('api/ip/<int:pk>', views.IPDetail.as_view(), name='IP-detail'),
]