from django.db import models
from django.utils import timezone
from users.models import User

class PrivateMessage(models.Model):
	content = models.TextField()
	sender = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to=User, related_name="+")
	recever = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to=User, related_name="+")
	created_at = models.DateTimeField(default=timezone.now)

class Channel(models.Model):
	name = models.CharField(max_length=25, unique=True)
	owner = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to=User, related_name='+')
	created_at = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(default=timezone.now)

	users = models.ManyToManyField(User, related_name="channel", related_query_name="channel", through='Membership')

	def addUser(self, user: User) -> None:
		self.users.add(user)

	def contains(self, user: User) -> bool:
		return self.users.filter(pk=user.pk).exists() or user == self.owner

class Membership(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
	joined_at = models.DateTimeField(default=timezone.now)


class Message(models.Model):
	content = models.TextField()
	channel = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to=Channel)
	user = models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to=User)
	created_at = models.DateTimeField(default=timezone.now)
