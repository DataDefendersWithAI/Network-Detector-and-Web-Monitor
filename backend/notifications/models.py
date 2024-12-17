from django.db import models

# Notification model
class Notification(models.Model):
    message = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.message