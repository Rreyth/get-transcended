from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from users.models import User
from django.conf import settings
import jwt

@database_sync_to_async
def get_user(validated_token):
    try:
        user = get_user_model().objects.get(id=validated_token["user_id"])
        return user
   
    except User.DoesNotExist:
        return None

import sys

class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, app):
        self.inner = app

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"]
        query_params = query_string.decode()
        query_dict = parse_qs(query_params)
        
        if "token" not in query_dict:
            return None
        
        token = query_dict["token"][0]

        try:
            jwt_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidSignatureError:
            return None

        user = await get_user(jwt_token)
        
        if user is None:
            return None

        scope["user"] = user
        return await super().__call__(scope, receive, send)

def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))