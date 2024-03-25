from django.db import models
from django.db.models.functions import Now

class User(models.Model):
	pseudo = models.CharField(max_length=25)
	avatar = models.TextField(blank=True, default='')
	email = models.CharField(max_length=255)
	password = models.TextField()
	bot = models.BooleanField(null=True, default=False)
	token = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)

	class Meta:
		db_table = "myapp_users"
		constraints = [
			models.UniqueConstraint(fields=['pseudo', 'email', 'token'], name="unique user")
		]

class PrivateMessage(models.Model):
	content = models.TextField()
	sender = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="sender")
	recever = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="recever")
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

	class Meta:
		db_table = "myapp_private_messages" 

class Channel(models.Model):
	name = models.CharField(max_length=25)
	owner = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)

	class Meta:
		db_table = "myapp_channels"

class Message(models.Model):
	content = models.TextField()
	channel = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='Channel')
	user = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

	class Meta:
		db_table = "myapp_messages"
