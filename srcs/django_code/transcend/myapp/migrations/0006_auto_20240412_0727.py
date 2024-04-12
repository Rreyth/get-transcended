# Generated by Django 3.2.8 on 2024-04-12 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_auto_20240320_1629'),
    ]

    operations = [
        migrations.CreateModel(
            name='games',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='users')),
                ('looser', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='users')),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'myapp_games',
            },
        ),
    ]
