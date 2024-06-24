import factory
from factory.django import DjangoModelFactory
from users.models import User

from faker import Faker

fake = Faker()

class UserFactory(DjangoModelFactory):
	class Meta:
		model = User
		django_get_or_create = ('username',)
		exclude = ('gen_username','gen_img')

	@factory.lazy_attribute
	def gen_username(self):
		profile = fake.profile()
		return profile['username']

	@factory.lazy_attribute
	def gen_img(self):
		img = fake.image((64, 64), "png")
		path = f"profile/{self.username}.png"
		with open(path, "w+b") as file:
			file.write(img)
		return f"/profile/{self.username}.png"

	username = factory.LazyAttribute(lambda this: this.gen_username)
	email = factory.LazyAttribute(lambda this: f"{this.username}@gmail.com")

	avatar = factory.LazyAttribute(lambda this: this.gen_img)
