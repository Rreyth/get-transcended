from rest_framework import serializers
from .models import PrivateMessage

class PrivateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = ('id', 'content', 'sender', 'recever', 'created_at')