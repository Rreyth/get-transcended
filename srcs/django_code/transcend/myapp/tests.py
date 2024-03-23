from django.test import TestCase
from myapp.models import *

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")

    def testGetUser(self):
        user = User.objects.get(pseudo="test")

        self.assertIsNotNone(user)

class PrivateMessageTestCase(TestCase):

    user = None

    def setUp(self) -> None:
        self.user = User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")
        PrivateMessage.objects.create(content="Je suis un content", sender_id=self.user, recever_id=self.user)
    
    def testGetPrivateMessage(self):
        message = PrivateMessage.objects.get(sender_id=self.user)