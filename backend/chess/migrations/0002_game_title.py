# Generated by Django 4.2.3 on 2023-07-06 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chess', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='title',
            field=models.CharField(default='Chess Game', max_length=100),
        ),
    ]
