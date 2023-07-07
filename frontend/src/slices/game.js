import { createSlice, current } from "@reduxjs/toolkit";

import {
  algebraicChessNotationToMove,
  fenToString,
  getPieceColor,
  getPieceType,
  movePiece,
  moveToAlgebraicChessNotation,
  printBoard,
} from "../utils";
import { pieceTypes } from "../pieces";

const gameReducer = createSlice({
  name: "game",
  initialState: {
    turn: "w",
    board: Array(64).fill(0),
    selected: null,
    legalMoves: [],
    history: [],
    moveNumber: 0,
    stringFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    FEN: {
      board: Array(64).fill(0),
      turn: "w",
      castling: "KQkq",
      enPassant: -1,
      halfMoveClock: 0,
      fullMoveNumber: 0,
    },
    activePiece: null,
  },
  reducers: {
    setBoard: (state, action) => {
      state.FEN = action.payload;
    },
    rotateTurn: (state, action) => {
      state.turn = state.turn === "w" ? "b" : "w";
    },
    setTurn: (state, action) => {
      state.turn = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setActivePiece: (state, action) => {
      state.activePiece = action.payload;
    },
    setLegalMoves: (state, action) => {
      state.legalMoves = action.payload;
    },

    setFen: (state, action) => {
      state.FEN = action.payload;
    },

    recordMove: (state, action) => {
      state.moveNumber = state.history.length + 1;
      state.history.push(action.payload);
    },

    setMoveNumber: (state, action) => {
      const newMoveNumber = Math.max(
        0,
        Math.min(action.payload + state.moveNumber, state.history.length)
      );
      const diff = newMoveNumber - state.moveNumber;
      for (let i = 0; i < Math.abs(diff); i += 1) {
        const { move, notation, capturedPiece } =
          state.history[state.moveNumber + (diff < 0 ? -i - 1 : i)];
        if (diff < 0) {
          state.FEN.board = movePiece(current(state.FEN.board), {
            from: move.to,
            to: move.from,
          });
          if (capturedPiece) {
            state.FEN.board[move.to] = capturedPiece;
          }
        } else
          state.FEN.board = movePiece(current(state.FEN.board), {
            from: move.from,
            to: move.to,
          });
      }

      state.moveNumber = newMoveNumber;
    },

    handleMove: (state, action) => {
      const { from, to } = action.payload;
      let { board, enPassant, turn, castling, halfMoveClock, fullMoveNumber } =
        state.FEN;

      const type = getPieceType(board[from]);
      const color = getPieceColor(board[from]);
      const capturedPiece = board[to];

      halfMoveClock += 1;

      //board
      board = movePiece(board, { from, to });

      // castling
      let toRemove = [];
      if (type === pieceTypes.King) {
        if (color === pieceTypes.White) toRemove += "KQ";
        else toRemove += "kq";
      } else if (type === pieceTypes.Rook) {
        if (color === pieceTypes.White) {
          if (from === 7) toRemove += "K";
          else if (from === 0) toRemove += "Q";
        } else {
          if (from === 63) toRemove += "k";
          else if (from === 56) toRemove += "q";
        }
      } else if (type === pieceTypes.Pawn) {
        halfMoveClock = 0;
        if (color === pieceTypes.White) {
          if (to - from === 16) enPassant = to - 8;
          else if (to - from === -16) enPassant = to + 8;
          if (enPassant === to) board[to - 8] = 0;
        } else {
          if (to - from === 16) enPassant = to - 8;
          else if (to - from === -16) enPassant = to + 8;
          if (enPassant === to) board[to + 8] = 0;
        }
      }

      castling = castling.replace(new RegExp(`[${toRemove}]`, "g"), "");
      const notation = moveToAlgebraicChessNotation(state.FEN, from, to);
      fullMoveNumber = turn === "w" ? fullMoveNumber + 1 : fullMoveNumber;
      state.moveNumber +=1;
      state.history.push({ move: { from, to }, notation, capturedPiece });
      turn = turn === "w" ? "b" : "w";
      state.FEN = {
        board,
        turn,
        castling,
        enPassant,
        halfMoveClock,
        fullMoveNumber,
      };
    },
    loadGame: (state, action) => {
      const moves = action.payload;
      let fen = state.FEN;
      let board = fen.board;
      for(let index = 0; index < moves.length; index++){
        const notation = moves[index];
        fen.turn = fen.turn === "w" ? "b" : "w";
        const move = algebraicChessNotationToMove({...fen, board}, notation)
        if(!move|| move.from === -1)  break;

        const capturedPiece = board[move.to]

        board = movePiece(board, move)
        
        state.history.push({ move, notation, capturedPiece })

      }
    },
  },
});

export const selectBoard = (state) => state.game.board;
export const selectTurn = (state) => state.game.turn;
export const selectSelected = (state) => state.game.selected;
export const selectLegalMoves = (state) => state.game.legalMoves;
export const selectHistory = (state) => state.game.history;
export const selectMoveNumber = (state) => state.game.moveNumber;
export const selectStringFEN = (state) => state.game.stringFEN;
export const selectFen = (state) => state.game.FEN;
export const selectActivePiece = (state) => state.game.activePiece;

export const {
  setBoard,
  setTurn,
  setSelected,
  setLegalMoves,
  recordMove,
  rotateTurn,
  setMoveNumber,
  handleMove,
  loadGame
} = gameReducer.actions;

export default gameReducer.reducer;
