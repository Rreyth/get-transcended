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

class PrivateMessages(models.Model):
	content = models.TextField()
	sender_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User")
	recever_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User")
	created_at = models.DateTimeField(auto_now_add=True, blank=True, default=Now())

class Channel(models.Model):
	name = models.CharField(max_length=25)
	owner_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True, default=Now())
	updated_at = models.DateTimeField(auto_now_add=True, blank=True, default=Now())

class Message(models.Model):
	content = models.TextField()
	channel_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='channels')
	user_id = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True, default=Now())
