import pieces, { pieceTypes } from "./pieces";

import {
  isOccupied,
  getPieceColor,
  isSameColor,
  movePiece,
  getRank,
  getFile,
  newSquare,
  getPieceType,
  isValidSquare,
} from "./utils";

const calculateLegalMovesForPiece = (fen, source, depth = 0) => {
  const piece = fen.position[source];
  const type = getPieceType(piece);
  const color = getPieceColor(piece);
  let legalMoves;
  switch (type.toLowerCase()) {
    case "p":
      legalMoves = calculatePawnMoves(fen, source);
      break;
    case "r":
      legalMoves = calculateRookMoves(fen, source);
      break;
    case "n":
      legalMoves = calculateKnightMoves(fen, source);
      break;
    case "b":
      legalMoves = calculateBishopMoves(fen, source);
      break;
    case "q":
      legalMoves = calculateQueenMoves(fen, source);
      break;
    case "k":
      if (depth) return calculateCandidateKingMoves(fen, source);
      else return calculateKingMoves(fen, source);
    default:
      return [];
  }

  if (depth) return legalMoves;
  console.log("Piece's legal moves: ", legalMoves);

  return legalMoves.filter((move) => {
    // console.log("From: ", source, " To: ", move);
    return !isKingAttacked(
      { ...fen, position: movePiece(fen.position, { from: source, to: move }) },
      color
    );
  });
};

function calculatePawnMoves({ position, enPassant }, source) {
  // console.log(position, enPassant, source, piece);
  const piece = position[source];
  let rank = getRank(source);
  let file = getFile(source);
  const color = getPieceColor(piece);
  const candidateMoves = [];
  const colorCoefficient = color === "w" ? 1 : -1;
  const isOnStartingSquare = color === "w" ? rank === 2 : rank === 7;

  if (!isOccupied(position, newSquare(file, rank, 0, colorCoefficient))) {
    candidateMoves.push(newSquare(file, rank, 0, colorCoefficient));
    if (
      isOnStartingSquare &&
      !isOccupied(position, newSquare(file, rank, 0, colorCoefficient * 2))
    )
      candidateMoves.push(newSquare(file, rank, 0, colorCoefficient * 2));
  }

  [-1, 1].forEach((offset) => {
    const to = newSquare(file, rank, offset, colorCoefficient);
    if (isOccupied(position, to) && !isSameColor(position[to], piece))
      candidateMoves.push(to);
    else if (to === enPassant && !isSameColor(position[to], piece))
      candidateMoves.push(to);
  });
  //Need to account for en passant
  const legalMoves = candidateMoves.filter(
    (square) => !isSameColor(position[square], piece)
  );
  return legalMoves;
}

function calculateRookMoves({ position }, source) {
  const piece = position[source];
  const rank = getRank(source);
  const file = getFile(source);
  const fileIndex = file.charCodeAt(0) - 97;
  const rankIndex = rank - 1;
  let legalMoves = [];
  [fileIndex, rankIndex].forEach((index, i) => {
    let encounteredSource = false;
    let moves = [];
    for (var j = 0; j < 8; j++) {
      if (j === index) {
        encounteredSource = true;
        continue;
      }
      const to =
        i === 0
          ? newSquare(file, rank, j - index, 0)
          : newSquare(file, rank, 0, j - index);
      if (!isOccupied(position, to) || !isSameColor(position[to], piece))
        moves.push(to);
      else {
        if (encounteredSource) break;
        moves = [];
        continue;
      }
    }
    legalMoves.push(...moves);
  });
  return legalMoves;
}

function calculateBishopMoves({ position }, source) {
  const piece = position[source];
  let legalMoves = [];
  const rank = getRank(source);
  const file = getFile(source);
  const rankIndex = rank - 1;
  const fileIndex = file.charCodeAt(0) - 97;
  [rankIndex + fileIndex + 1, 8 - fileIndex + rankIndex].forEach(
    (loopLength, i) => {
      let encounteredSource = false;
      let candidateMoves = [];
      for (var j = 0; j < loopLength; j++) {
        const to =
          i === 0
            ? newSquare(file, rank, rankIndex - j, j - rankIndex)
            : newSquare(file, rank, j - rankIndex, j - rankIndex);
        if (to === source) {
          encounteredSource = true;
          continue;
        }
        if (!isOccupied(position, to) || !isSameColor(position[to], piece))
          candidateMoves.push(to);
        else {
          if (encounteredSource) break;
          candidateMoves.length = 0;
          continue;
        }
      }
      legalMoves.push(...candidateMoves);
    }
  );
  return legalMoves;
}

function calculateKnightMoves({ position }, source) {
  const piece = position[source];
  let legalMoves = [];
  const rank = getRank(source);
  const file = getFile(source);
  [-2, -1, 1, 2].forEach((rankOffset) => {
    const fileOffset = Math.abs(rankOffset) === 2 ? 1 : 2;
    [-fileOffset, fileOffset].forEach((fileOffset) => {
      const to = newSquare(file, rank, fileOffset, rankOffset);
      if (
        isValidSquare(to) &&
        (!isOccupied(position, to) || !isSameColor(position[to], piece))
      )
        legalMoves.push(to);
    });
  });
  return legalMoves;
}

function calculateQueenMoves({ position }, source) {
  return [
    ...calculateBishopMoves({ position }, source),
    ...calculateRookMoves({ position }, source),
  ];
}

function calculateCandidateKingMoves({ position }, source) {
  const piece = position[source];
  let legalMoves = [];
  const rank = getRank(source);
  const file = getFile(source);
  [-1, 0, 1].forEach((fileOffset) => {
    [-1, 0, 1].forEach((rankOffset) => {
      if (fileOffset === 0 && rankOffset === 0) return;
      const to = newSquare(file, rank, fileOffset, rankOffset);
      if (
        isValidSquare(to) &&
        (!isOccupied(position, to) || !isSameColor(position[to], piece))
      )
        legalMoves.push(to);
    });
  });
  return legalMoves;
}

export function calculateKingMoves(fen, source) {
  const { position, castling } = fen;
  const candidateMoves = calculateCandidateKingMoves(fen, source);
  const color = getPieceColor(position[source]);
  const legalMoves = candidateMoves.filter((move) => {
    return !isKingAttacked(
      { ...fen, position: movePiece(position, { from: source, to: move }) },
      color
    );
  });
  if (isKingAttacked(fen, color)) return legalMoves;
  let castleLong = "Q", castleShort = "K", rank = 1;
  if (color === "b"){
    rank = 8;
    castleShort = "q";
    castleLong = "k";
  }
  if (
    castling.includes(castleShort) &&
    legalMoves.includes(`f${rank}`) &&
    !isOccupied(position, `g${rank}`) &&
    !isKingAttacked(
      {
        ...fen,
        position: movePiece(fen.position, { from: source, to: `g${rank}` }),
      },
      color
    )
  )
    legalMoves.push(`g${rank}`);
  if (
    castling.includes(castleLong) &&
    !isOccupied(position, `b${rank}`) &&
    !isOccupied(position, `c${rank}`) &&
    legalMoves.includes(`d${rank}`) &&
    !isKingAttacked(
      {
        ...fen,
        position: movePiece(fen.position, { from: source, to: `c${rank}` }),
      },
      color
    )
  )
    legalMoves.push(`c${rank}`);
  return legalMoves;
}

export const calculateLegalMoves = (fen, color, depth = 0) => {
  const { position } = fen;

  const squares = Object.keys(position)
    .map((square) => (position[square][0] === color ? square : null))
    .filter((square) => square !== null);
  const moves = squares
    .map((source) => {
      return calculateLegalMovesForPiece(fen, source, depth);
    })
    .reduce((acc, val) => acc.concat(val), []);
  return moves;
};

export default calculateLegalMovesForPiece;

export function isKingAttacked(fen, color) {
  const { position } = fen;
  const kingSquare = Object.keys(position).find(
    (square) => position[square] === `${color}K`
  );
  const opponentColor = color === "w" ? "b" : "w";
  const opponentMoves = calculateLegalMoves(fen, opponentColor, 1);
  return opponentMoves.includes(kingSquare);
}
