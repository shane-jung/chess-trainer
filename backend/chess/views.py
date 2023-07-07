from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .serializers import GameSerializer
from .models import Game

# Create your views here.

class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()