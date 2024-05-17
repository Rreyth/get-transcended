from rest_framework import serializers
from .models import PrivateMessage
from users.serializer import UserSerializer

class PrivateMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recever = UserSerializer(read_only=True)
    
    class Meta:
        model = PrivateMessage
        fields = ('id', 'content', 'sender', 'recever', 'created_at')