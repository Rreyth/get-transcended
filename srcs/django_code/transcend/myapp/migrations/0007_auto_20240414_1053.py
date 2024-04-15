# Generated by Django 3.2.8 on 2024-04-14 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_auto_20240412_0727'),
    ]

    operations = [
        migrations.CreateModel(
            name='matche_user',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='users')),
                ('matche', models.ForeignKey(on_delete=models.deletion.DO_NOTHING, to='matches')),
                ('win', models.BooleanField()),
            ],
            options={
                'db_table': 'myapp_matche_user',
            },
        ),
    ]
