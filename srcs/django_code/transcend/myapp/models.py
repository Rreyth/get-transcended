from django.db import models
from django.utils import timezone
from users.models import User

class Match(models.Model):
	mode = models.CharField(max_length=255) # name of the game
	created_at = models.DateTimeField(default=timezone.now)

	users = models.ManyToManyField(User, related_name="match", related_query_name="match", through='Player')

	def addWinner(self, player: User):
		Player.objects.create(user=player, match=self, win=True)
	
	def addLooser(self, player: User):
		Player.objects.create(user=player, match=self, win=False)
   
	def getWinner(self):
		return self.users.get(player__win=True, match=self)

	def getLooser(self):
		return self.users.get(player__win=False, match=self)

	class Meta:
		db_table = 'myapp_matches'

class Player(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	match = models.ForeignKey(Match, on_delete=models.CASCADE)
	win = models.BooleanField()

	class Meta:
		db_table = "myapp_match_user"
