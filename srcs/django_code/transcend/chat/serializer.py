from rest_framework import serializers
from .models import *
from users.serializer import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recever = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(read_only=True, many=True)
    
    class Meta:
        model = Group
        fields = '__all__'