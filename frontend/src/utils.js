import calculateLegalMovesForPiece, {
  calculateLegalMoves,
  isKingAttacked,
} from "./calculateMoves";
import { pieceTypes, pieceValues } from "./pieces";

const isOccupied = (board, index) => board[index] !== 0;

const getColor = (board, index) => {
  if (board[index] & pieceTypes.White) return pieceTypes.White;
  if (board[index] & pieceTypes.Black) return pieceTypes.Black;
  else return 0;
};

const getType = (board, index) => board[index] & 0b111;

const isSameColor = (board, from, to) =>
  !(getColor(board, from) !== getColor(board, to));

const movePiece = (board, { from, to }) => {
  const newBoard = [...board];
  newBoard[to] = newBoard[from];
  newBoard[from] = 0;
  return newBoard;
};

const moveToAlgebraicChessNotation = (fen, from, to) => {
  const board = fen.board;
  const type = getType(board, from);
  const color = getColor(board, from);
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

const algebraicChessNotationToMove = (fen, notation) => {
  if (notation === "O-O")
    return {
      from: fen.turn === pieceTypes.White ? 4 : 60,
      to: fen.turn === pieceTypes.White ? 6 : 62,
    };
  if (notation === "O-O-O")
    return {
      from: fen.turn === pieceTypes.White ? 4 : 60,
      to: fen.turn === pieceTypes.White ? 2 : 58,
    };

  //regex in short algebraic chess notation
  const regex =
    /^([NBRQK]?)([a-h]?)([1-8]?)(x?)([a-h][1-8])(=[NBRQK]?)?(\+|#)?$/;
  const matches = notation.match(regex);
  if (!matches) return null;
  const [, type, file, rank, capture, to, promotion] = matches;
  const turn = fen.turn === "b" ? pieceTypes.White : pieceTypes.Black;
  const candidatePieces = fen.board
    .map((piece, index) => {
      if (
        getType(fen.board, index) === pieceTypes.Pawn &&
        getColor(fen.board, index) === turn
      )
        return index;
      if (
        getType(fen.board, index) === pieceTypes[type] &&
        getColor(fen.board, index) === turn
      )
        return index;
      return null;
    })
    .filter((index) => index !== null);
  const index = to.charCodeAt(0) - 97 + (8 - parseInt(to[1])) * 8;

  //find piece that can move to the square
  const piece = candidatePieces.find((from) => {
    const moves = calculateLegalMovesForPiece(fen, from);
    return moves.includes(index);
  });

  return {
    from: piece,
    to: index,
  };
};

function checkGameOver(fen) {
  if (fen.fullMoveNumber === 0) return false;
  const board = fen.board;
  const turn = fen.turn;
  const color = turn === "w" ? 0b1000 : 0b10000;
  const king = color | pieceTypes.King;
  const kingIndex = board.indexOf(king);
  const legalKingMoves = calculateLegalMovesForPiece(fen, kingIndex);
  // console.log(legalMoves, isKingAttacked(fen, kingIndex));
  return (
    legalKingMoves.length === 0 &&
    isKingAttacked(fen, color) &&
    calculateLegalMoves(fen, color).length === 0
  );
}

function fenToString(fen) {
  let file = 0;
  const boardString = fen.board.map((piece, index) => {
    if (piece === 0) return;
    const type = piece & 0b111;
    const color = piece & 0b1000;
    const pieceString = ["P", "N", "B", "R", "Q", "K"][type - 1];
    if (color === 0b1000) return pieceString.toLowerCase();
    return pieceString;
  });
  return boardString.join("");
}

export function evaluatePosition(fen){
  const {board} = fen
  let score = 0
  board.forEach((piece, index) => {
    if(piece === 0) return
    const color = getColor(board, index)
    const pieceType = getType(piece)
    if(color === pieceTypes.White){
      score+= pieceValues[pieceType]
    } else {
      score-= pieceValues[pieceType]
    }
  })
  return score
}


export {
  isOccupied,
  getColor,
  getType,
  isSameColor,
  movePiece,
  moveToAlgebraicChessNotation,
  algebraicChessNotationToMove,
  checkGameOver,
  fenToString,
};
