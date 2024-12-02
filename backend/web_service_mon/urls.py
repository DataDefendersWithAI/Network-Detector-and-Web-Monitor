from django.urls import path
from . import views

urlpatterns = [
    path('api/web-monitor/', views.WebsiteHistoryView.as_view(), name='web-monitor-list'),
    path('api/web-monitor/run/', views.WebsiteMonitorView.as_view(), name='web-monitor-all'),
    path('api/web-monitor/add/', views.AddWebsiteView.as_view(), name='add-web-to-monitor'),
]