from .models import Match, Player
from users.serializer import UserSerializer, DynamicFieldsModelSerializer

class MatchSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Match
        fields = ('id', 'mode', 'online', 'borderless', 'obstacle', 'square', 'score', 'created_at')

class PlayerSerializer(DynamicFieldsModelSerializer):
    match = MatchSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Player
        fields = ('id', 'match', 'user', 'win', 'score')