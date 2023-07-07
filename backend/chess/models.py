from django.db import models

# Create your models here.


class Game(models.Model):
    PGN = models.CharField(max_length=2048)
    title = models.CharField(max_length=100, default ="Chess Game")

    def _str_(self):
        return self.PGN