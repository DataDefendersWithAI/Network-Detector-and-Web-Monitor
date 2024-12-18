from django.apps import AppConfig

class SpeedtestMonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'speedtest_mon'

    def ready(self):
        import notifications.signals