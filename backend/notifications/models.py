from django.db import models

# Notification model
class Notification(models.Model):
    message = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    # status can be 'New', 'Read', or 'Dismissed'
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.message
    
# LastChecked model for storing the last time the database was checked for changes, essential for the DatabaseChangeDetector class
class LastChecked(models.Model):
    last_checked_float = models.FloatField()
    last_checked_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.last_checked_float