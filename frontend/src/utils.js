import calculateLegalMovesForPiece, {
  calculateLegalMoves,
  isKingAttacked,
} from "./calculateMoves";
import { pieceTypes } from "./pieces";

const isOccupied = (board, index) => board[index] !== 0;

const getPieceColor = (piece) => {
  if (piece & pieceTypes.White) return pieceTypes.White;
  if (piece & pieceTypes.Black) return pieceTypes.Black;
  else return 0;
};

const isSameColor = (piece1, piece2) =>
  !(getPieceColor(piece1) !== getPieceColor(piece2));

const getPieceType = (piece) => piece & 0b111;

const movePiece = (board, { from, to }) => {
  const newBoard = [...board];
  newBoard[to] = newBoard[from];
  newBoard[from] = 0;

  if (getPieceType(newBoard[to]) === pieceTypes.King) {
    if (to === from + 2) {
      newBoard[from + 1] = newBoard[from + 3];
      newBoard[from + 3] = 0;
    }
    if (to === from - 2) {
      newBoard[from - 1] = newBoard[from - 4];
      newBoard[from - 4] = 0;
    }
  }
  if (getPieceType(newBoard[to]) === pieceTypes.Pawn && (to < 8 || to > 55)) {
    newBoard[to] = pieceTypes.Queen | getPieceColor(newBoard[to]);
  }
  return newBoard;
};

const moveToUCI = ({ from, to }) => {
  console.log(from, to);
  const squares = "abcdefgh";
  return `${squares[from % 8]}${Math.floor(from / 8) + 1}${squares[to % 8]}${
    Math.floor(to / 8) + 1
  }`;
};
const moveToAlgebraicChessNotation = (fen, from, to) => {
  const board = fen.board;
  const type = getPieceType(board[from]);
  const color = getPieceColor(board[from]);
  const oppositeColor =
    color === pieceTypes.White ? pieceTypes.Black : pieceTypes.White;
  const isCheck = isKingAttacked(
    { ...fen, board: movePiece(fen.board, { from, to }) },
    oppositeColor
  );
  const isCapture = isOccupied(board, to);
  const squares = "abcdefgh";
  const pieces = ["", "N", "B", "R", "Q", "K"];

  return `${pieces[type - 1].toUpperCase()}${
    isCapture && type === 1 ? squares[from % 8] : ""
  }${isCapture ? "x" : ""}${squares[to % 8]}${Math.floor(to / 8) + 1}${
    isCheck ? "+" : ""
  }`;
};

export function parsePGN(pgn) {
  const i = pgn.lastIndexOf("]");
  // const header = pgn.slice(0, i + 1);
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
  let file = 0;
  const pieces = ["P", "N", "B", "R", "Q", "K"];
  const boardString = fen.board.map((_, index) => {
    const rank = index % 8;
    const pieceFile = Math.floor(index/8)
    const piece = fen.board[63- (pieceFile* 8 + (7-rank))];
    let slash = "";
    let letter
    if (piece !== 0) {
      letter =
        (file > 0 ? file.toString() : "") + pieces[getPieceType(piece) - 1];
      if(getPieceColor(piece) === pieceTypes.Black) letter = letter.toLowerCase()
      file = 0;
    } else {
      letter = "";
      file++;
    }
    if ((index + 1) % 8 === 0) {
      if (index !== 63) slash =  (file > 0 ? file.toString() : "") + "/";
      else slash = file;
      file = 0;
    }

    return letter + slash;
  });
  const enPassant = fen.enPassant === -1 ? "-" : `${"abcdefgh"[fen.enPassant%8]}${Math.floor(fen.enPassant/8)+ 1}`;
  console.log(enPassant);
  const castling = fen.castling === "" ? "-" : fen.castling
  return `${boardString.join("")} ${fen.turn} ${castling} ${enPassant} ${fen.halfMoveClock} ${fen.fullMoveNumber}`;
}

function printBoard(board) {
  //convert board to 8 by 8 2d array
  let board2d = [];
  for (let i = 0; i < 8; i++) {
    board2d.push(board.slice((7 - i) * 8, (7 - i) * 8 + 8));
  }
  const boardString = board2d.map((row) => {
    return row.map((piece) => {
      if (piece === 0) return "";
      const type = getPieceType(piece);
      const pieceString = ["♟", "♞", "♝", "♜", "♛", "♚"][type - 1];
      return pieceString;
    });
  });
  console.table(boardString);
}

export {
  isOccupied,
  getPieceColor,
  getPieceType,
  isSameColor,
  movePiece,
  moveToAlgebraicChessNotation,
  algebraicChessNotationToMove,
  checkGameOver,
  fenToString,
  printBoard,
  moveToUCI,
};
