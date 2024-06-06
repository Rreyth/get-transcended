from .models import Match, Player
from users.models import User
from users.serializer import UserSerializer, DynamicFieldsModelSerializer
from rest_framework import serializers

class MatchSerializer(DynamicFieldsModelSerializer):
    players = serializers.SerializerMethodField()
    adversaries = serializers.SerializerMethodField()
    target_user_info = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ('id', 'mode', 'online', 'borderless', 'obstacle', 'square', 'score', 'created_at', 'players', 'adversaries', 'target_user_info')

    def get_players(self, obj):
        from .serializer import PlayerSerializer
        players = obj.players.all()
        return PlayerSerializer(players, many=True, fields=('user', 'win', 'score')).data
    
    def get_adversaries(self, obj):
        target_username = self.context.get('target_username', None)
        if not target_username:
            return []

        try:
            target_user = User.objects.get(username=target_username)
        except User.DoesNotExist:
            return []

        try:
            adversaries = obj.players.exclude(user=target_user)
            same_named_players = obj.players.filter(user__username=target_username).exclude(user=target_user)
            first_player = same_named_players.first()
            if first_player:
                adversaries = adversaries.exclude(id=first_player.id)
            adversaries |= same_named_players
            return PlayerSerializer(adversaries, many=True, fields=('user', 'win', 'score')).data
        except Player.DoesNotExist:
            return []

    def get_target_user_info(self, obj):
        target_username = self.context.get('target_username', None)
        if not target_username:
            return None

        try:
            target_user = User.objects.get(username=target_username)
        except User.DoesNotExist:
            return None

        try:
            player = obj.players.filter(user=target_user).first()
            if player:
                return PlayerSerializer(player).data
            else:
                return None
        except Player.DoesNotExist:
            return None

class PlayerSerializer(DynamicFieldsModelSerializer):
    match = MatchSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Player
        fields = ('id', 'match', 'user', 'win', 'score')