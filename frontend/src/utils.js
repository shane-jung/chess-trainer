import calculateLegalMovesForPiece, {
  calculateLegalMoves,
  isKingAttacked,
} from "./calculateMoves";
import { pieceTypes } from "./pieces";

import { objToFen } from "chessboard-element";

const isOccupied = (position, square) => {
  // console.log("isOccupied: ", position, square)
  return Object.keys(position).includes(square);
  // position.includes((occupiedSquare) => occupiedSquare === square)
};

const getPieceColor = (piece) => piece[0];

const getPieceType = (piece) => piece[1];

const getRank = (square) => Number(square[1]);
const getFile = (square) => square[0];

const isSameColor = (piece1, piece2) => {
  if (!piece1 || !piece2) return false;
  return !(getPieceColor(piece1) !== getPieceColor(piece2));
};

const movePiece = (position, { from, to }) => {
  const newPosition = { ...position };
  newPosition[to] = newPosition[from];
  delete newPosition[from];

  if (getPieceType(newPosition[to]) === "K") {
    const rank = getRank(to);
    const fileDifference =
      getFile(to).charCodeAt(0) - getFile(from).charCodeAt(0);
    if (Math.abs(fileDifference) === 2) {
      let files = ["f", "h"];
      if (fileDifference < 0) files = ["d", "a"];
      const oldRookPosition = `${files[1]}${rank}`;
      const newRookPosition = `${files[0]}${rank}`;
      newPosition[newRookPosition] = newPosition[oldRookPosition];
      delete newPosition[oldRookPosition];
    }
  }
  return newPosition;
};

const moveToUCI = ({ from, to }) => {
  return `${from}${to}`;
};

const moveToAlgebraicChessNotation = (
  position,
  from,
  to,
  capturedPiece,
  inCheck
) => {
  const pieceType = getPieceType(position[from]);
  const pieceChar = pieceType === "P" ? "" : pieceType;
  const check = inCheck ? "+" : "";
  return `${pieceChar}${capturedPiece ? "x" : ""}${to}${check}`;
};

export function parsePGN(pgn) {
  const i = pgn.lastIndexOf("]");
  const movesString = pgn.slice(i + 1);
  const regex = /\d+\.\s|\s/g;
  const movesList = movesString.split(regex).filter((move) => move !== "");
  return movesList;
}

const algebraicChessNotationToMove = (fen, notation) => {
  if (notation === "O-O")
    return {
      from: fen.turn === "b" ? 4 : 60,
      to: fen.turn === "b" ? 6 : 62,
    };
  if (notation === "O-O-O")
    return {
      from: fen.turn === "b" ? 4 : 60,
      to: fen.turn === "b" ? 2 : 58,
    };
  if (notation === "1-0" || notation === "0-1" || notation === "1/2-1/2")
    return null;

  const turnColor = fen.turn === "b" ? pieceTypes.White : pieceTypes.Black;

  const regex =
    /^([NBRQK]?)([a-h]?)([1-8]?)(x?)([a-h][1-8])(=[NBRQK]?)?(\+|#)?$/;

  const [, typeChar, file, rank, , toACN] = notation.match(regex);
  const to = toACN.charCodeAt(0) - 97 + (parseInt(toACN[1]) - 1) * 8;
  const typeValue = ["", "N", "B", "R", "Q", "K"].indexOf(typeChar) + 1;
  const from = fen.board.findIndex((pieceValue, pieceIndex) => {
    const pieceType = getPieceType(pieceValue);
    const pieceColor = getPieceColor(pieceValue);
    if (rank || file) {
      const pieceRank = Math.floor(pieceIndex / 8);
      const pieceFile = pieceIndex % 8;
      if (rank && pieceRank !== parseInt(rank) - 1) return false;
      if (file && pieceFile !== file.charCodeAt(0) - 97) return false;
    }
    if (pieceType === typeValue && pieceColor === turnColor)
      return calculateLegalMovesForPiece(fen, pieceIndex).includes(to);
    return false;
  });

  return { from, to };
};

function checkGameOver(fen) {
  if (fen.fullMoveNumber === 0) return false;
  const board = fen.board;
  const turn = fen.turn;
  const color = turn === "w" ? 0b1000 : 0b10000;
  const king = color | pieceTypes.King;
  const legalKingMoves = calculateLegalMovesForPiece(fen, board.indexOf(king));
  return (
    legalKingMoves.length === 0 &&
    isKingAttacked(fen, color) &&
    calculateLegalMoves(fen, color).length === 0
  );
}

function fenToString(fen) {
  const boardString = objToFen(fen.position);
  const castling = fen.castling === "" ? "-" : fen.castling;
  return `${boardString} ${fen.turn} ${castling} ${fen.enPassant} ${fen.halfMoveClock} ${fen.fullMoveNumber}`;
}

function newSquare(sourceFile, sourceRank, dx, dy) {
  const destRank = sourceRank + dy;
  const destFile = String.fromCharCode(dx + sourceFile.charCodeAt(0));
  return `${destFile}${destRank}`;
}

function isValidSquare(square) {
  const file = getFile(square);
  const rank = getRank(square);
  return file >= "a" && file <= "h" && rank >= 1 && rank <= 8;
}

export {
  isValidSquare,
  newSquare,
  isOccupied,
  getPieceColor,
  getPieceType,
  getRank,
  getFile,
  isSameColor,
  movePiece,
  moveToAlgebraicChessNotation,
  algebraicChessNotationToMove,
  checkGameOver,
  fenToString,
  moveToUCI,
};
