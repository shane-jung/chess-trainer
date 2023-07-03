import pieces from "./pieces";

export default function FENtoBoard(FEN) {
  const board = Array(64).fill(0);
  // console.log(board);
  let file = 0;
  let rank = 7;

  [...FEN].forEach((symbol) => {
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
  return board;
}
