from django.test import TestCase
from myapp.models import User

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(pseudo="test", email="test@test.com", password="pass", token="tokenpass")

    def test_get_user(self):
        user = User.objects.get(pseudo="test")

        self.assertIsNotNone(user)