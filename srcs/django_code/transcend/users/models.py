from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import validate_email
from django.utils import timezone

class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username)

        user.set_password(password)
        user.save(using=self._db)

        return user

class User(AbstractBaseUser):
	username = models.CharField(max_length=25, unique=True)
	avatar = models.TextField(blank=True, default='')
	email = models.EmailField(max_length=255, unique=True, validators=[validate_email])
	friends = models.ManyToManyField("User", blank=True)
	created_at = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(default=timezone.now)
 
	objects = UserProfileManager()
 
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def __str__(self) -> str:
		return self.username

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="from_user")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="to_user")