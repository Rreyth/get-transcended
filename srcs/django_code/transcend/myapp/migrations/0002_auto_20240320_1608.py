# Generated by Django 3.2.8 on 2024-03-20 16:08

from django.db import migrations, models
from django.db.models.functions import Now


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='private_messages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('sender', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="users", related_name="sender")),
                ('recever', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to="users")),
                ('created_at', models.DateTimeField(auto_now_add=True, blank=True, default=Now()))
            ]
        )
    ]
