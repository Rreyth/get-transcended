from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Match, Tournament
from .serializer import MatchSerializer
from users.models import User
import os

SECRET = os.getenv("SECRET")

class GameStorageView(APIView):
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def post(self, request):
		if 'secret' not in request.data:
			return Response({'message': 'Secret key is requiered'}, status=status.HTTP_400_BAD_REQUEST)
		elif request.data['secret'] != SECRET:
			return Response({'message': 'Invalid secret key'}, status=status.HTTP_401_UNAUTHORIZED)

		try:
			if request.data['mode'] == "tournament":
				self.TournamentStorage(request.data).save()
			else:
				self.MatchStorage(request.data['mode'], request.data['match'], request.data['customs'], request.data['online'], request.data['score']).save()
		except User.DoesNotExist:
			return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
  
		return Response({'message': 'Data saved in database'}, status=status.HTTP_201_CREATED)

	def MatchStorage(self, mode, players, customs, online, score):
		is_borderless = 'BORDERLESS' in customs
		has_obstacle = 'OBSTACLE' in customs
		is_square = '1V1V1V1' in customs
		match = Match.objects.create(mode=mode, online=online, score=score, borderless=is_borderless, obstacle=has_obstacle, square=is_square)
		for player in players:
			user = User.objects.get(username=player['username'])
			user.games += 1
			if player['win']:
				user.wins += 1
				match.addWinner(user, player['score'])
			else:
				match.addLooser(user, player['score'])
			user.winrate = int((user.wins / user.games) * 100)
			user.save()
		return match


	def TournamentStorage(self, data):
		is_borderless = 'BORDERLESS' in data['customs']
		has_obstacle = 'OBSTACLE' in data['customs']
		winner = User.objects.get(username=data['winner'])
  
		tournament = Tournament.objects.create(online=data['online'], borderless=is_borderless, obstacle=has_obstacle, score=data['score'], winner=winner)
  
		for player in data['players']:
			user = User.objects.get(username=player)
			tournament.users.add(user)
   
		for match in data['matches']:
			obj = self.MatchStorage('Tournament', match, data['customs'], data['online'], data['score'])
			tournament.matches.add(obj)

		return tournament

class GamesView(APIView):
	permission_classes = (IsAuthenticated,)
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def get(self, request, username):
		try:
			user = User.objects.get(username=username)
			matches = Match.objects.filter(players__user=user).order_by('-created_at').distinct()

			# Sérialiser les matchs avec les adversaires
			serializer = MatchSerializer(matches, many=True, context={'target_username': username})
			return Response(serializer.data)
		except User.DoesNotExist:
			return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)