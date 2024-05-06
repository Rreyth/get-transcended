from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from jwt import decode as jwt_decode
from rest_framework_simplejwt.state import User
from django.conf import settings

@database_sync_to_async
def get_user(validated_token):
    try:
        user = get_user_model().objects.get(id=validated_token["user_id"])
        # return get_user_model().objects.get(id=toke_id)
        print(f"{user}")
        return user
   
    except User.DoesNotExist:
        return None

import sys

class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        print("prout", file=sys.stderr)
        query_string = scope["query_string"]
        query_params = query_string.decode()
        query_dict = parse_qs(query_params)
        
        if "token" not in query_dict:
            print("non1", file=sys.stderr)
            return None
        
        token = query_dict["token"][0]
        user = await get_user(jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"]))
        
        if user is None:
            print("non2", file=sys.stderr)
            return None

        scope["user"] = user
        return await super().__call__(scope, receive, send)

def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))