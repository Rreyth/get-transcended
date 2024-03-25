from django.test import TestCase
from myapp.models import *

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")

    def testGetUser(self):
        user = User.objects.get(pseudo="test")

        self.assertIsNotNone(user)
        self.assertEquals(user.pseudo, "test")

class PrivateMessageTestCase(TestCase):

    user = None

    def setUp(self) -> None:
        self.user = User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")
        PrivateMessage.objects.create(content="Je suis un content", sender=self.user, recever=self.user)
    
    def testGetPrivateMessage(self):
        message = PrivateMessage.objects.get(sender=self.user)

        self.assertIsNotNone(message)

class ChannelTestCase(TestCase):

    user = None
    channelName = "channel-test"

    def setUp(self) -> None:
        self.user = User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")
        Channel.objects.create(name=self.channelName, owner=self.user)
    
    def testGetChannel(self):
        channel = Channel.objects.get(owner=self.user)

        self.assertIsNotNone(channel)
        self.assertEquals(channel.name, self.channelName)
        self.assertEquals(channel.owner, self.user)

class MessageTestCase(TestCase):
    
    user = None
    channel = None
    content = "Je suis un message"

    def setUp(self) -> None:
        self.user = User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")
        self.channel = Channel.objects.create(name="test", owner=self.user)
        Message.objects.create(content=self.content, user=self.user, channel=self.channel)

    def testGetMessage(self):
        message = Message.objects.get(user=self.user, channel=self.channel)

        self.assertIsNotNone(message)
        self.assertEquals(message.content, self.content)