from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from chat.models import *
from chat.serializer import *

class GroupLeaveView(APIView):
    def post(self, request, group_id):
        if group_id == 1:
            return Response({'message': 'You can\'t leave main chat'}, status=status.HTTP_403_FORBIDDEN)

        group = Group.objects.get(pk=group_id)

        group.members.remove(request.user)

        if (group.members.count() == 0):
            group.delete()

        return Response(status=status.HTTP_200_OK)
