from django.db import models

class User(models.Model):
	pseudo = models.TextField(max_length=25)
	avatar = models.TextField(null=True)
	email = models.TextField(max_length=255)
	password = models.TextField()
	bot = models.BooleanField(default=False)
	token = models.TextField()
	createdAt = models.DateTimeField(auto_now_add=True, blank=True)
	updatedAt = models.DateTimeField(auto_now_add=True, blank=True)
