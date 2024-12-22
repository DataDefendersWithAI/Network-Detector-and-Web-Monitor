from django.urls import path
from . import views 

urlpatterns = [
    path('api/notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/<int:id>/', views.NotificationUpdateView.as_view(), name='notification-update'),
    path('api/new-notifications/', views.NewNotificationListView.as_view(), name='new-notification-list'),
]