# Generated by Django 5.0.4 on 2024-06-03 23:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_games_user_winrate_user_wins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, default='media/frank.svg', upload_to='profile/'),
        ),
    ]
