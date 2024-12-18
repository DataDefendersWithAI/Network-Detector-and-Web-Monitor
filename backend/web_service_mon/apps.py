from django.apps import AppConfig

class WebServiceMonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'web_service_mon'

    def ready(self):
        import notifications.signals