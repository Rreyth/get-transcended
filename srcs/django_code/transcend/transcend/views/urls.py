from django.urls import path

from .home import *
from .sign import *

urlpatterns = [
	path('', home, name='home'),
	path('sign', sign, name='sign')
]
