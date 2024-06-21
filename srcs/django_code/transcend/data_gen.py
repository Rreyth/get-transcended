import os
import django
import argparse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcend.settings')
django.setup()

from data_generation.user_factory import UserFactory
from data_generation.match_factory import MatchFactory, fill_match

from users.models import User

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("-u", "--users", type=int, help="number of users to generate")
	parser.add_argument("-m", "--matchs", type=int, help="number of matchs to generate")
	args = parser.parse_args()

	if (args.users and args.users > 0):
		UserFactory.create_batch(args.users)

	if (args.matchs and args.matchs > 0 and User.objects.count() >= 5):
		matchs = MatchFactory.create_batch(args.matchs)
		for match in matchs:
			fill_match(match)
	elif (args.matchs):
		print("Can't create matches if there's not at least 4 users (excluding AI) in the database.")

if __name__ == '__main__':
	main()
