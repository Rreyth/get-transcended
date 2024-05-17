from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import User
from .models import PrivateMessage
from .serializer import PrivateMessageSerializer

class DMView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = PrivateMessageSerializer

    def get(self, request, user):
        u = User.objects.get(pk=user)
        messages = PrivateMessage.objects.filter(Q(recever=request.user, sender=u) | Q(recever=u, sender=request.user))
        serializer = PrivateMessageSerializer(messages, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, recever=self.request.user)