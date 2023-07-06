import pieces from "./pieces";

export default function decodeFEN(FEN) {
  const components = FEN.split(" ");

  const board = Array(64).fill(0);
  let file = 0;
  let rank = 7;

  [...components[0]].forEach((symbol) => {
    if (symbol === "/") {
      file = 0;
      rank--;
    } else {
      if (!isNaN(parseInt(symbol, 10))) {
        file += parseInt(symbol, 10);
      } else {
        board[rank * 8 + file] = pieces[symbol];
        file++;
      }
    }
  });
  return {
    board,
    turn: components[1],
    castling: components[2],
    enPassant: components[3],
    halfMoveClock: Number(components[4]),
    fullMoveNumber: Number(components[5]),
  };
}
