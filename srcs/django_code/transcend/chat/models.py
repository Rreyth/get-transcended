from django.db import models
from django.utils import timezone
from users.models import User

class Group(models.Model):
	name = models.CharField(max_length=255)
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	members = models.ManyToManyField(User, related_name='groups')
	created_at = models.DateTimeField(default=timezone.now)

class Message(models.Model):
	content = models.TextField()
	sender = models.ForeignKey(User, on_delete=models.CASCADE)
	receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='received_messages')
	group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True)
	created_at = models.DateTimeField(default=timezone.now)
