from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class User(AbstractBaseUser):
	username = models.CharField(max_length=25, unique=True)
	avatar = models.TextField(blank=True, default='')
	email = models.CharField(max_length=255, unique=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)
 
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []

	def __str__(self) -> str:
		return self.username