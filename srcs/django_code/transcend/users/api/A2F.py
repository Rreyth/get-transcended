from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import pyotp
import qrcode
import qrcode.image.svg

class A2fView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        url_generate = pyotp.totp.TOTP(request.user.a2f_secret).provisioning_uri(name=request.user.email, issuer_name='Transcendence')
        qr = qrcode.QRCode(image_factory=qrcode.image.svg.SvgPathImage)
        qr.add_data(url_generate)
        qr.make(fit=True)

        img = qr.make_image()
        svg = img.to_string(encoding='unicode')

        svg = svg.replace('fill="#000000"', f'fill="white"')
        return Response({ "actived": request.user.a2f, "qrcode": svg }, status=status.HTTP_200_OK)

    def post(self, request):
        userCode = str(request.data["a2f_code"])
        totp = pyotp.TOTP(request.user.a2f_secret)
        if totp.verify(userCode):
            return Response({"succes": True}, status=status.HTTP_200_OK)
        return Response({"succes": False}, status=status.HTTP_400_BAD_REQUEST)

class A2fConnexionView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        userCode = str(request.data["a2f_code"])
        user = User.objects.get(username=request.data["username"])
        totp = pyotp.TOTP(user.a2f_secret)
        if totp.verify(userCode):
            refresh = RefreshToken.for_user(user)
            refresh["username"] = user.username
            refresh['avatar'] = user.avatar.url if user.avatar and hasattr(user.avatar, 'url') else None
            refresh['email'] = user.email
            if (user.login42):
                refresh['login42'] = user.login42
            return Response({'access' : str(refresh.access_token)}, status=status.HTTP_200_OK)
        return Response({"a2f": "a2f_code_false"}, status=status.HTTP_400_BAD_REQUEST)