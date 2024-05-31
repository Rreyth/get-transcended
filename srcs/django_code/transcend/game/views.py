from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .models import Match, Tournament
import os
import sys

SECRET = os.getenv("SECRET")

class GameStorageView(APIView):
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def post(self, request):
		if 'secret' not in request.data:
			return Response({'message': 'Secret key is requiered'}, status=status.HTTP_400_BAD_REQUEST)
		elif request.data['secret'] != SECRET:
			return Response({'message': 'Invalid secret key'}, status=status.HTTP_401_UNAUTHORIZED)

		print(request.data, file=sys.stderr, flush=True)
		
		return Response({'message': 'Data saved in database'}, status=status.HTTP_201_CREATED)


# try
# 	user = User.objects.get(usermame="name")
#	tournament.users.add(user)
# except User.DoesNotExist:
#	aaaaaaaaa