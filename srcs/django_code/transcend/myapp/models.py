from django.db import models
from django.db.models.functions import Now

class User(models.Model):
	pseudo = models.CharField(max_length=25, unique=True)
	avatar = models.TextField(blank=True, default='')
	email = models.CharField(max_length=255, unique=True)
	password = models.TextField()
	bot = models.BooleanField(null=True, default=False)
	token = models.TextField(unique=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)

	def __str__(self) -> str:
		return self.pseudo

	class Meta:
		db_table = "myapp_users"

class PrivateMessage(models.Model):
	content = models.TextField()
	sender = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="+")
	recever = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="User", related_name="+")
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

	class Meta:
		db_table = "myapp_private_messages" 

class Channel(models.Model):
	name = models.CharField(max_length=25, unique=True)
	owner = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User', related_name='+')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True)

	users = models.ManyToManyField(User, related_name="channel", related_query_name="channel", through='Membership')

	def addUser(self, user: User) -> None:
		self.users.add(user)
	
	def contains(self, user: User) -> bool:
		return self.users.filter(pk=user.pk).exists() or user == self.owner

	class Meta:
		db_table = "myapp_channels"

class Membership(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
	joined_at = models.DateTimeField(auto_now=True, blank=True)

	class Meta:
		db_table = "myapp_channel_user"

class Message(models.Model):
	content = models.TextField()
	channel = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='Channel')
	user = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User')
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

	class Meta:
		db_table = "myapp_messages"

class Game(models.Model):
	winner = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User', related_name='+')
	looser = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='User', related_name='+')
	name = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True, blank=True)

	class Meta:
		db_table = 'myapp_games'
