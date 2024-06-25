from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
import pyotp


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
	otp_token = serializers.CharField(required=False, allow_blank=True)

	def validate(self, request):
		credentials = {
			self.username_field: request.get(self.username_field),
			'password': request.get('password')
		}
		user = authenticate(**credentials)

		if user:
			if user.a2f:
				otp_token = request.get('otp_token')
				if not otp_token:
					raise serializers.ValidationError({'otp_token': '2faNeeded'})
				
				totp = pyotp.TOTP(user.a2f_secret)
				if not totp.verify(otp_token):
					raise serializers.ValidationError({'otp_token': '2faInvalid'})
			data = super().validate(request)
			
			refresh = self.get_token(self.user)

			refresh['username'] = user.username
			refresh['avatar'] = user.avatar.url if user.avatar and hasattr(user.avatar, 'url') else None
			refresh['email'] = user.email
			refresh['login42'] = user.login42

			data['refresh'] = str(refresh)
			data['access'] = str(refresh.access_token)
			return data
		else:
			raise serializers.ValidationError({'error': 'Identifiants invalides'})

class CustomTokenObtainPairView(TokenObtainPairView):
	serializer_class = CustomTokenObtainPairSerializer