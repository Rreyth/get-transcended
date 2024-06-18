from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import User
from chat.models import *
from chat.serializer import *

class GroupView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, group_id):
        group = Group.objects.get(pk=group_id)
        serializer = GroupSerializer(group)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, group_id):
        g = Group.objects.get(pk=group_id)
        if request.user == g.owner:
            g.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, group_id):
        group = Group.objects.get(pk=group_id)

        data = request.data
        if 'name' in data:
            group.name = data['name']

        if 'members' in data:
            members = data['members']
            if isinstance(members, list):
                for member in members:
                    try:
                        user = User.objects.get(username=member)
                        group.members.add(user)
                    except User.DoesNotExist:
                        return Response({'error': f'User with id {member} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Group update'}, status=status.HTTP_200_OK)
