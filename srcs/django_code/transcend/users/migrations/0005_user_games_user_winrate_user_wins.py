# Generated by Django 5.0.4 on 2024-05-31 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_friends_friendrequest_delete_friend'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='games',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='winrate',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='wins',
            field=models.IntegerField(default=0),
        ),
    ]
