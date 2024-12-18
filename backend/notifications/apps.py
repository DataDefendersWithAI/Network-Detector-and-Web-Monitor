from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'

class LastCheckedConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'last_checked'