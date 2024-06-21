import factory
from factory.django import DjangoModelFactory
from users.models import User
from game.models import Match

from django.db.models.functions import Random
import pytz

import random

from faker import Faker

fake = Faker()

class MatchFactory(DjangoModelFactory):
	class Meta:
		model = Match
		django_get_or_create = ('created_at',)
		exclude = ('gen_date')

	@factory.lazy_attribute
	def gen_date(self):
		timezone = pytz.timezone('UTC')
		naive_datetime = fake.date_time()
		return timezone.localize(naive_datetime)

	created_at = factory.LazyAttribute(lambda this: this.gen_date)
	online = factory.Faker('boolean')
	borderless = factory.Faker('boolean')
	obstacle = factory.Faker('boolean')
	mode = factory.LazyFunction(lambda: ["quick", "square", "team"][fake.random_int(min=0, max=2)])
	square = factory.LazyAttribute(lambda this: True if this.mode == "square" else False)
	score = factory.LazyFunction(lambda: fake.random_int(min=10, max=20))

def get_random_users(nb):
	random_users = []
	for i in range (nb):
		rand_user = User.objects.annotate(random_value=Random()).order_by('random_value').first()
		while ((rand_user in random_users) or rand_user.username == "AI"):
			rand_user = User.objects.annotate(random_value=Random()).order_by('random_value').first()
		random_users.append(rand_user)
	return random_users

def addWinner(match, users, winners):
	winner_index = random.randint(0, len(users) - 1)
	while (users[winner_index] in winners):
		winner_index = random.randint(0, len(users) - 1)
	users[winner_index].games += 1
	users[winner_index].wins += 1
	match.addWinner(users[winner_index], match.score)
	winners.append(users[winner_index])

def fill_quickmatch(match):
	random_users = get_random_users(2)
	winners = []
	addWinner(match, random_users, winners)
	for user in random_users:
		if (user not in winners):
			match.addLooser(user, random.randint(0, match.score - 1))
			user.games += 1
		user.save()

def fill_squarematch(match):
	random_users = get_random_users(4)
	winners = []
	addWinner(match, random_users, winners)
	for user in random_users:
		if (user not in winners):
			match.addLooser(user, random.randint(0, match.score - 1))
			user.games += 1
		user.save()

def fill_teammatch(match):
	random_users = get_random_users(4)
	winners = []
	addWinner(match, random_users, winners)
	addWinner(match, random_users, winners)
	loosers_score = random.randint(0, match.score - 1)
	for user in random_users:
		if (user not in winners):
			match.addLooser(user, loosers_score)
			user.games += 1
		user.save()

def fill_match(match):
	if (match.mode == "quick"):
		fill_quickmatch(match)
	elif (match.mode == "square"):
		fill_squarematch(match)
	else:
		fill_teammatch(match)
