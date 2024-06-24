from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from game.models import Match
from game.serializer import MatchSerializer
from users.models import User

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
