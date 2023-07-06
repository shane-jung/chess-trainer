export const pieceTypes= { 
  Pawn: 1,
  Knight: 2,
  Bishop: 3,
  Rook: 4,
  Queen: 5,
  King: 6,
  Black: 8,
  White: 16,
  None: 0,

}

const pieces = {
  p: pieceTypes.Pawn | pieceTypes.Black,
  n: pieceTypes.Knight | pieceTypes.Black,
  b: pieceTypes.Bishop | pieceTypes.Black,
  r: pieceTypes.Rook | pieceTypes.Black,
  q: pieceTypes.Queen | pieceTypes.Black,
  k: pieceTypes.King | pieceTypes.Black,
  P: pieceTypes.Pawn | pieceTypes.White,
  N: pieceTypes.Knight | pieceTypes.White,
  B: pieceTypes.Bishop | pieceTypes.White,
  R: pieceTypes.Rook | pieceTypes.White,
  Q: pieceTypes.Queen | pieceTypes.White,
  K: pieceTypes.King | pieceTypes.White,
};


export const pieceValues = [1, 3, 3, 5, 9, 0]



export default pieces;