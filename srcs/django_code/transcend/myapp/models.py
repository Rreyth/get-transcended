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

class Private_Messages(models.Model):
	content = models.TextField()
	sender_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="sender")
	recever_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="recever")
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

class Channels(models.Model):
	name = models.CharField(max_length=25)
	owner_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)

class Messages(models.Model):
	content = models.TextField()
	channel_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='channels')
	user_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
