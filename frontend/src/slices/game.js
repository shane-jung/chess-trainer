import { createSlice, current } from "@reduxjs/toolkit";

import {
  algebraicChessNotationToMove,
  getPieceColor,
  getPieceType,
  movePiece,
  moveToAlgebraicChessNotation,
  fenToString,
  newSquare,
  getRank,
  getFile,
} from "../utils";
import { pieceTypes } from "../pieces";
import { isKingAttacked } from "../calculateMoves";

const gameReducer = createSlice({
  name: "game",
  initialState: {
    turn: "w",
    position: Array(64).fill(0),
    selected: null,
    legalMoves: [],
    history: [],
    moveNumber: 0,
    stringFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    fen: {
      position: {},
      turn: "w",
      castling: "KQkq",
      enPassant: "-",
      halfMoveClock: 0,
      fullMoveNumber: 0,
    },
    activePiece: null,
  },
  reducers: {
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
      state.fen = action.payload;
    },

    recordMove: (state, action) => {
      state.moveNumber = state.history.length + 1;
      state.history.push(action.payload);
    },

    setMoveNumber: (state, action) => {
      const newMoveNumber = action.payload;
      const diff = newMoveNumber - state.moveNumber;
      let turn = state.fen.turn;
      for (let i = 0; i < Math.abs(diff); i += 1) {
        turn = turn === "w" ? "b" : "w";
        const { move, capturedPiece } =
          state.history[state.moveNumber + (diff < 0 ? -i - 1 : i)];
        const { from, to } = diff < 0 ? { from: move.to, to: move.from } : move;

        state.fen = {
          ...state.fen,
          turn,
          position: movePiece(current(state.fen.position), {
            from,
            to,
          }),
        };
        if (diff < 0 && capturedPiece)
          state.fen.position[move.to] = capturedPiece;
      }
      state.stringFen = fenToString(state.fen);
      state.moveNumber = newMoveNumber;
    },

    handleMove: (state, action) => {
      const { from, to } = action.payload;

      let {
        position,
        enPassant,
        turn,
        castling,
        halfMoveClock,
        fullMoveNumber,
      } = state.fen;
      const type = getPieceType(position[from]);
      const color = getPieceColor(position[from]);
      const capturedPiece = position[to];

      halfMoveClock += 1;
      enPassant = "-";

      //position
      position = movePiece(position, { from, to });

      // castling
      let toRemove = [];
      if (type === "K") {
        if (color === "w") toRemove += "KQ";
        else toRemove += "kq";
      } else if (type === "R") {
        if (color === "w") {
          if (from === "h1") toRemove += "K";
          else if (from === "a1") toRemove += "Q";
        } else {
          if (from === "h8") toRemove += "k";
          else if (from === "a8") toRemove += "q";
        }
      } else if (type === "P") {
        halfMoveClock = 0;
        const colorCoefficient = color === "w" ? 1 : -1;
        const toRank = getRank(to);
        const fromRank = getRank(from);
        const rankDifference = Math.abs(toRank - fromRank);
        if (rankDifference === 2)
          enPassant = newSquare(getFile(to), toRank, 0, - colorCoefficient);
        if (state.enPassant === to) console.log("Captured En Passant");
      }

      castling = castling.replace(new RegExp(`[${toRemove}]`, "g"), "");
      fullMoveNumber = turn === "w" ? fullMoveNumber + 1 : fullMoveNumber;
      state.moveNumber += 1;
      turn = turn === "w" ? "b" : "w";
      const newFen = {
        position,
        turn,
        castling,
        enPassant,
        halfMoveClock,
        fullMoveNumber,
      };
      const notation = moveToAlgebraicChessNotation(state.fen.position, from, to, capturedPiece, isKingAttacked(newFen, turn));
      state.history.push({ move: { from, to }, notation, capturedPiece });

      state.fen = newFen;
      state.stringFen = fenToString(newFen);
    },
    loadGame: (state, action) => {
      const moves = action.payload;
      let fen = state.fen;
      let position = fen.position;
      for (let index = 0; index < moves.length; index++) {
        const notation = moves[index];
        fen.turn = fen.turn === "w" ? "b" : "w";
        const move = algebraicChessNotationToMove(
          { ...fen, position },
          notation
        );
        if (!move || move.from === -1) break;

        const capturedPiece = position[move.to];

        position = movePiece(position, move);

        state.history.push({ move, notation, capturedPiece });
      }
    },
  },
});

export const selectTurn = (state) => state.game.turn;
export const selectSelected = (state) => state.game.selected;
export const selectLegalMoves = (state) => state.game.legalMoves;
export const selectHistory = (state) => state.game.history;
export const selectMoveNumber = (state) => state.game.moveNumber;
export const selectStringFen = (state) => state.game.stringFen;
export const selectFen = (state) => state.game.fen;
export const selectActivePiece = (state) => state.game.activePiece;

export const {
  setTurn,
  setSelected,
  setLegalMoves,
  recordMove,
  setMoveNumber,
  handleMove,
  loadGame,
} = gameReducer.actions;

export default gameReducer.reducer;
