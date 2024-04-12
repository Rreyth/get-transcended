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
    
    def testUniqueName(self):
        try:
            User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")

            self.fail('Duplicate user')
        except:
            pass

class PrivateMessageTestCase(TestCase):

    user = None

    def setUp(self) -> None:
        self.user = User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")
        PrivateMessage.objects.create(content="Je suis un content", sender=self.user, recever=self.user)
    
    def testGetPrivateMessage(self) -> None:
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

    def testUsersInChannel(self) -> None:
        channel = Channel.objects.get(owner=self.user)
        user = User.objects.create(pseudo="cool", email="cool@test.com", password="pass", token="tokenpasspass")

        channel.addUser(user)

        self.assertTrue(channel.contains(user))
        self.assertTrue(channel.contains(self.user))

        user = User.objects.create(pseudo="notcool", email="notcool@test.com", password="pass", token="tokenpasspasspass")

        self.assertFalse(channel.contains(user))

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

class GameTestCase(TestCase):

    winner = None
    looser = None
    name = 'normal'

    def setUp(self) -> None:
        self.winner = User.objects.create(pseudo="test1", email="test1@test.com", password="pass", token="tokenpass1")
        self.looser = User.objects.create(pseudo="test2", email="test2@test.com", password="pass", token="tokenpass2")
        Game.objects.create(winner=self.winner, looser=self.looser, name=self.name)

    def testGetMessage(self):
        game = Game.objects.get(name=self.name)

        self.assertIsNotNone(game)
        self.assertEquals(game.winner, self.winner)
        self.assertEquals(game.looser, self.looser)
