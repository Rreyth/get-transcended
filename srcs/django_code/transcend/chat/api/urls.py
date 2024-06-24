from django.urls import path

from .DM import *
from .Group import *
from .GroupLeave import *
from .GroupMessages import *
from .Groups import *

urlpatterns = [
	path('api/user/dm/<str:username>', DMView.as_view()),
	path('api/user/groups/<int:group_id>', GroupView.as_view()),
	path('api/user/groups/<int:group_id>/leave', GroupLeaveView.as_view()),
	path('api/user/groups/<int:group_id>/messages', GroupMessagesView.as_view()),
	path('api/user/groups/', GroupsView.as_view())
]
