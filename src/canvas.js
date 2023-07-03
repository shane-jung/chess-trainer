import pieces from "./pieces";

export default function initializeBoard() {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const boardWidth = canvas.width;
  Array(8)
    .fill(0)
    .map((_, rank) => {
      Array(8)
        .fill(0)
        .map((_, file) => {
          ctx.fillStyle = (rank + file) % 2 === 0 ? "#FFFFFF" : "#000000";
          ctx.fillRect(
            (rank * boardWidth) / 8,
            (file * boardWidth) / 8,
            boardWidth / 8,
            boardWidth / 8
          );
        });
    });
}

export function drawBoard(board) {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const boardWidth = canvas.width;
  const boardHeight = canvas.height;
  board.map((piece, index) => {
    const img = new Image();
    img.src = `./pieces/bP.svg`;
    img.onload = () =>
      ctx.drawImage(
        img,
        (index % 8) * (boardWidth / 8),
        Math.floor(index / 8) * (boardHeight / 8),
        boardWidth / 8,
        boardHeight / 8
      );
  });
}
