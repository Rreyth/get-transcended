from django.db import models
from django.utils import timezone
from users.models import User


class Match(models.Model):
	mode = models.CharField(max_length=255)
	online = models.BooleanField()
	borderless = models.BooleanField()
	obstacle = models.BooleanField()
	square = models.BooleanField()
	score = models.IntegerField(default=10)
	created_at = models.DateTimeField(default=timezone.now)

	users = models.ManyToManyField(User, related_name="match", related_query_name="match", through='Player')

	def addWinner(self, player: User, score):
		Player.objects.create(user=player, match=self, score=score, win=True)
	
	def addLooser(self, player: User, score):
		Player.objects.create(user=player, match=self, score=score, win=False)
   
	def getWinners(self):
		return self.users.filter(player__win=True, match=self)

	def getLoosers(self):
		return self.users.filter(player__win=False, match=self)


class Player(models.Model):
	user = models.ForeignKey(User, related_name='players', on_delete=models.CASCADE)
	match = models.ForeignKey(Match, related_name='players', on_delete=models.CASCADE)
	score = models.IntegerField(default=0)
	win = models.BooleanField()

class Tournament(models.Model):
	online = models.BooleanField()
	borderless = models.BooleanField()
	obstacle = models.BooleanField()
	score = models.IntegerField(default=10)
	winner = models.ForeignKey(User, on_delete=models.CASCADE)

	created_at = models.DateTimeField(default=timezone.now)

	users = models.ManyToManyField(User, related_name="+")
	matches = models.ManyToManyField(Match, related_name="+")
