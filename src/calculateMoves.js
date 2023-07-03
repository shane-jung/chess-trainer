import pieces from "./pieces";

export const calculateLegalMoves = (board, color, depth=0) => {
  // console.log(board, color);
  const selector = color === "w" ? 0b10000 : 0b1000;
  // console.log("Selector: ", selector);
  const pieces = board.map((piece, index) => (piece & selector) ? index : null).filter((piece) => piece !== null);
  // console.log(pieces);
  const moves = pieces.map(element => {
    return calculateLegalMovesForPiece(board, element, depth);
  }).reduce((acc, val) => acc.concat(val), []);
  
  return moves;
}

const calculateLegalMovesForPiece= (board, index, depth) => {
  const type = Object.keys(pieces).find((key) => pieces[key] === board[index]);
  switch (type.toLowerCase()) {
    case "p":
      return calculatePawnMoves(board, index);
    case "r":
      return calculateRookMoves(board, index);
    case "n":
      return calculateKnightMoves(board, index);
    case "b":
      return calculateBishopMoves(board, index);
    case "q":
      return calculateQueenMoves(board, index);
    case "k":
      if(depth) return calculateCandidateKingMoves(board, index); 
      else return calculateKingMoves(board, index)
    default:
      return [];
  }
};

function isOccupied(board, index) {
  return board[index] !== 0;
}

function isSameColor(board, index1, index2) {
  return (
    board[index1] & board[index2] & 0b10000 ||
    board[index1] & board[index2] & 0b1000
  );
}

function calculatePawnMoves(board, index) {
  let rank = Math.floor(index / 8);
  let file = index % 8;
  const candidateMoves = [];
  const color = board[index] & 0b10000 ? "w" : "b";
  if (color === "b") {
    if (!isOccupied(board, index - 8)) candidateMoves.push(index - 8);
    if (rank === 6 && !isOccupied(board, index - 16))
      candidateMoves.push(index - 16);
    if (file > 0 && isOccupied(board, index - 9))
      candidateMoves.push(index - 9);
    if (file < 7 && isOccupied(board, index - 7))
      candidateMoves.push(index - 7);
  } else {
    if (!isOccupied(board, index + 8)) candidateMoves.push(index + 8);
    if (rank === 1 && !isOccupied(board, index + 16))
      candidateMoves.push(index + 16);
    if (file > 0 && isOccupied(board, index + 7))
      candidateMoves.push(index + 7);
    if (file < 7 && isOccupied(board, index + 9))
      candidateMoves.push(index + 9);
  }
  const legalMoves = candidateMoves.filter(
    (move) => !isSameColor(board, index, move)
  );

  return legalMoves;                     
}

function calculateRookMoves(board, index) {
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
    (move) => !isSameColor(board, index, move)
  );
  // console.log(legalMoves);
  return legalMoves;
}

function calculateBishopMoves(board, index) {
  const candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  for (let i = -1; i >= -Math.min(file, rank); i--) {
    //up and left
    candidateMoves.push(index + i + i * 8);
    if (isOccupied(board, index + i + i * 8)) break;
  }
  for (let i = 1; i < Math.min(8 - rank, 8 - file); i++) {
    //down and right
    candidateMoves.push(index + i + i * 8);
    if (isOccupied(board, index + i + i * 8)) break;
  }
  for (let i = -1; i >= 1 - Math.min(8 - file, 1 + rank); i--) {
    //up and right
    candidateMoves.push(index - i + i * 8);
    if (isOccupied(board, index - i + i * 8)) break;
  }
  for (let i = 1; i < Math.min(file, 8-rank); i++) {
    //down and left
    candidateMoves.push(index - i + i * 8);
    if (isOccupied(board, index - i + i * 8)) break;
  }
  const legalMoves = candidateMoves.filter(
    (move) => !isSameColor(board, index, move)
  );
  return legalMoves;
}

function calculateKnightMoves(board, index) {
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
    (move) => !isSameColor(board, index, move)
  );

  // console.log(index, legalMoves);
  return legalMoves;
}

function calculateQueenMoves(board, index) {
  return [
    ...calculateBishopMoves(board, index),
    ...calculateRookMoves(board, index),
  ];
}

function calculateCandidateKingMoves(board, index) {
  let candidateMoves = [];
  const rank = Math.floor(index / 8);
  const file = index % 8;
  const white = board[index] & 0b10000;
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

  if(true){ //if king hasn't moved yet
    if(!white){
      if(board[61] === 0 && board[62] === 0){ //need to check that rook hasn't moved yet
        candidateMoves.push(62);
      }
      if(board[59] === 0 &&  board[58] === 0 && board[57] === 0){
        candidateMoves.push(58);
      }
    }else{
      if(board[5] === 0 && board[6] === 0 ){
        candidateMoves.push(6);
      }
      if(board[1] === 0 && board[2] === 0 && board[3] === 0 ){
        candidateMoves.push(2);
      }
    }
  }

  return candidateMoves.filter((move)=>!isSameColor(board, index, move));
}

export function calculateKingMoves(board, index){
  const candidateMoves = calculateCandidateKingMoves(board, index);
  const white = board[index] & 0b10000;
  const legalMoves = candidateMoves.filter(move => { 
    const newBoard = [...board];
    newBoard[move] = newBoard[index];
    newBoard[index] = 0;
    return !calculateLegalMoves(newBoard, white ? "b": "w", 1).includes(move);
  })
  console.log(legalMoves);
  return legalMoves;
}

export default calculateLegalMovesForPiece;
