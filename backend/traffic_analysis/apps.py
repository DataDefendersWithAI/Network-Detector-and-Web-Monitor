from django.apps import AppConfig

class TrafficAnalysisConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'traffic_analysis'

    def ready(self):
        import notifications.signals