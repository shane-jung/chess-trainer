import pieces, { pieceTypes } from "./pieces";

import { isOccupied, getPieceColor, isSameColor, movePiece } from "./utils";

const calculateLegalMovesForPiece = (FEN, index, depth) => {
  let legalMoves;
  const type = Object.keys(pieces).find(
    (key) => pieces[key] === FEN.board[index]
  );
  switch (type.toLowerCase()) {
    case "p":
      legalMoves = calculatePawnMoves(FEN, index);
      break;
    case "r":
      legalMoves = calculateRookMoves(FEN, index);
      break;
    case "n":
      legalMoves = calculateKnightMoves(FEN, index);
      break;
    case "b":
      legalMoves = calculateBishopMoves(FEN, index);
      break;
    case "q":
      legalMoves = calculateQueenMoves(FEN, index);
      break;
    case "k":
      if (depth) return calculateCandidateKingMoves(FEN, index);
      else return calculateKingMoves(FEN, index);
    default:
      return [];
  }
  if (depth) return legalMoves;

  const { board } = FEN;
  const color = getPieceColor(board[index]);
  return legalMoves.filter((move) => {
    return !isKingAttacked(
      { ...FEN, board: movePiece(FEN.board, { from: index, to: move }) },
      color
    );
  });
};

function calculatePawnMoves({ board, enPassant }, index) {
  let rank = Math.floor(index / 8);
  let file = index % 8;
  const candidateMoves = [];
  if (board[index] & pieceTypes.White) {
    if (!isOccupied(board, index + 8)) candidateMoves.push(index + 8);
    if (
      rank === 1 &&
      !isOccupied(board, index + 16) &&
      !isOccupied(board, index + 8)
    )
      candidateMoves.push(index + 16);
    if ((file > 0 && isOccupied(board, index + 7)) || index + 7 === enPassant)
      candidateMoves.push(index + 7);
    if ((file < 7 && isOccupied(board, index + 9)) || index + 9 === enPassant)
      candidateMoves.push(index + 9);
  } else {
    if (!isOccupied(board, index - 8)) candidateMoves.push(index - 8);
    if (
      rank === 6 &&
      !isOccupied(board, index - 16) &&
      !isOccupied(board, index - 8)
    )
      candidateMoves.push(index - 16);
    if ((file > 0 && isOccupied(board, index - 9)) || index - 9 === enPassant)
      candidateMoves.push(index - 9);
    if ((file < 7 && isOccupied(board, index - 7)) || index - 7 === enPassant)
      candidateMoves.push(index - 7);
  }

  const legalMoves = candidateMoves.filter(
    (to) => !isSameColor(board[index], board[to])
  );
  return legalMoves;
}

function calculateRookMoves({ board }, index) {
  const candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  for (let i = -1; i >= -file; i--) {
    if (isOccupied(board, index + i)) {
      candidateMoves.push(index + i);
      break;
    }
    candidateMoves.push(index + i);
  }
  for (let i = 1; i < 8 - file; i++) {
    if (isOccupied(board, index + i)) {
      candidateMoves.push(index + i);
      break;
    }
    candidateMoves.push(index + i);
  }
  for (let i = -1; i >= -rank; i--) {
    if (isOccupied(board, index + 8 * i)) {
      candidateMoves.push(index + 8 * i);
      break;
    }
    candidateMoves.push(index + 8 * i);
  }
  for (let i = 1; i < 8 - rank; i++) {
    if (isOccupied(board, index + 8 * i)) {
      candidateMoves.push(index + 8 * i);
      break;
    }
    candidateMoves.push(index + 8 * i);
  }
  const legalMoves = candidateMoves.filter(
    (move) => !isSameColor(board[index], board[move])
  );
  return legalMoves;
}

function calculateBishopMoves({ board }, index) {
  const candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  for (let i = -1; i >= -Math.min(file, rank); i--) {
    //down and left
    candidateMoves.push(index + i + i * 8);
    if (isOccupied(board, index + i + i * 8)) break;
  }
  for (let i = 1; i < Math.min(8 - rank, 8 - file); i++) {
    //up and right
    candidateMoves.push(index + i + i * 8);
    if (isOccupied(board, index + i + i * 8)) break;
  }
  for (let i = -1; i >= 1 - Math.min(8 - file, 1 + rank); i--) {
    //down and right
    candidateMoves.push(index - i + i * 8);
    if (isOccupied(board, index - i + i * 8)) break;
  }
  for (let i = 1; i <= Math.min(file, 8 - rank); i++) {
    //up and left
    candidateMoves.push(index - i + i * 8);
    if (isOccupied(board, index - i + i * 8)) break;
  }
  const legalMoves = candidateMoves.filter(
    (move) => !isSameColor(board[index], board[move])
  );
  // console.log(legalMoves);
  return legalMoves;
}

function calculateKnightMoves({ board }, index) {
  let candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  if (file > 0) {
    if (rank > 1) candidateMoves.push(index - 17);
    if (rank < 6) candidateMoves.push(index + 15);
  }
  if (file > 1) {
    if (rank > 0) candidateMoves.push(index - 10);
    if (rank < 7) candidateMoves.push(index + 6);
  }
  if (file < 6) {
    if (rank > 0) candidateMoves.push(index - 6);
    if (rank < 7) candidateMoves.push(index + 10);
  }
  if (file < 7) {
    if (rank > 1) candidateMoves.push(index - 15);
    if (rank < 6) candidateMoves.push(index + 17);
  }
  let legalMoves = candidateMoves.filter(
    (move) => !isSameColor(board[index], board[move])
  );
  return legalMoves;
}

function calculateQueenMoves({ board }, index) {
  return [
    ...calculateBishopMoves({ board }, index),
    ...calculateRookMoves({ board }, index),
  ];
}

function calculateCandidateKingMoves(FEN, index) {
  let candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  if (file > 0) {
    candidateMoves.push(index - 1);
    if (rank > 0) candidateMoves.push(index - 9);
    if (rank < 7) candidateMoves.push(index + 7);
  }
  if (file < 7) {
    candidateMoves.push(index + 1);
    if (rank > 0) candidateMoves.push(index - 7);
    if (rank < 7) candidateMoves.push(index + 9);
  }
  if (rank > 0) candidateMoves.push(index - 8);
  if (rank < 7) candidateMoves.push(index + 8);

  return candidateMoves.filter(
    (move) => !isSameColor(FEN.board[index], FEN.board[move])
  );
}

export function calculateKingMoves(FEN, index) {
  const { board, castling } = FEN;
  const candidateMoves = calculateCandidateKingMoves(FEN, index);
  const color = getPieceColor(board[index]);
  const legalMoves = candidateMoves.filter((move) => {
    return !isKingAttacked(
      { ...FEN, board: movePiece(FEN.board, { from: index, to: move }) },
      color
    );
  });
  if (!isKingAttacked(FEN, color)) {
    //if king and rook haven't moved yet.

    if (color === pieceTypes.White) {
      if (
        legalMoves.includes(5) &&
        board[6] === 0 &&
        castling.includes("K") &&
        !isKingAttacked(
          { ...FEN, board: movePiece(FEN.board, { from: index, to: 6 }) },
          color
        )
      ) {
        legalMoves.push(6);
      }
      if (
        board[1] === 0 &&
        board[2] === 0 &&
        castling.includes("Q") &&
        legalMoves.includes(3) &&
        !isKingAttacked(
          { ...FEN, board: movePiece(FEN.board, { from: index, to: 2 }) },
          color
        )
      ) {
        legalMoves.push(2);
      }
    } else {
      if (
        board[62] === 0 && 
        castling.includes("k") &&
        legalMoves.includes(61) &&
        !isKingAttacked(
          { ...FEN, board: movePiece(FEN.board, { from: index, to: 62 }) },
          color
        ) 
      ) {
        legalMoves.push(62);
      }
      if (
        board[57] === 0 &&
        board[58] === 0 &&
        castling.includes("q") &&
        legalMoves.includes(59) &&
        
        !isKingAttacked(
          { ...FEN, board: movePiece(FEN.board, { from: index, to: 58 }) },
          color
        ) 
      ) {
        legalMoves.push(58);
      }
    }
  }
  return legalMoves;
}

export const calculateLegalMoves = (FEN, color, depth = 0) => {
  const { board } = FEN;

  const pieces = board
    .map((piece, index) => (piece & color ? index : null))
    .filter((piece) => piece !== null);
  const moves = pieces
    .map((index) => {
      return calculateLegalMovesForPiece(FEN, index, depth);
    })
    .reduce((acc, val) => acc.concat(val), []);

  return moves;
};

export default calculateLegalMovesForPiece;

export function isKingAttacked(FEN, color) {
  const index = FEN.board.indexOf(color | pieceTypes.King);
  const opponentColor =
    color & pieceTypes.White ? pieceTypes.Black : pieceTypes.White;
  const opponentMoves = calculateLegalMoves(FEN, opponentColor, 1);

  return opponentMoves.includes(index);
}
