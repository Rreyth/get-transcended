from django.db import models

class User(models.Model):
	pseudo = models.TextField(max_length=25)
	password = models.TextField()
