import json
from django.shortcuts import render

from django.http import JsonResponse
from django.views import View

# Create your views here.

from rest_framework import viewsets
from .serializers import GameSerializer
from .models import Game

from stockfish import Stockfish

stockfish = Stockfish()

# Create your views here.

class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()


class EngineView(View):
    def get(self, request):
        position = request.GET.get('fen', '')
        if stockfish._is_fen_syntax_valid(position):
            stockfish.set_fen_position(position)    
            print(stockfish.get_board_visual())
            print(stockfish.get_best_move())
        else: 
            print("Invalid FEN syntax")
        return JsonResponse(stockfish.get_evaluation())