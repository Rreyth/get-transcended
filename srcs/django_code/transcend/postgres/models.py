from django.db import models

# Create your models here.
class Teacher(models.Model):
    pseudo = models.CharField(max_length=25)
    age = models.BooleanField()
