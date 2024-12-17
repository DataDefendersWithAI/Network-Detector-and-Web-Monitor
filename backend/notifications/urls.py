from django.urls import path
from . import views 

urlpatterns = [
    path('api/notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/:id/', views.NotificationUpdateView.as_view(), name='notification-update'),
]