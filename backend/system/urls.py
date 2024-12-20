from django.urls import path
from . import views 

urlpatterns = [
    path('api/system/', views.SystemView.as_view(), name='system'),
]