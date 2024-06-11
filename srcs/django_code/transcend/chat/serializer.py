from rest_framework import serializers
from .models import *
from users.serializer import *

class MessageSerializer(DynamicFieldsModelSerializer):
    sender = UserSerializer(read_only=True)
    recever = UserSerializer(read_only=True)
    group = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Message
        fields = '__all__'
        
    def get_group(self, obj):
        from .serializer import GroupSerializer
        group = obj.group
        return GroupSerializer(group).data

class GroupSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(read_only=True, many=True)
    
    class Meta:
        model = Group
        fields = '__all__'