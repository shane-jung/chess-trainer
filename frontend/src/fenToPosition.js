import pieces from "./pieces";
import { fenToObj } from "chessboard-element";

export default function fenToPosition(fen) {
  const components = fen.split(" ");
  return {
    position: fenToObj(components[0]),
    turn: components[1],
    castling: components[2],
    enPassant: components[3],
    halfMoveClock: Number(components[4]),
    fullMoveNumber: Number(components[5]),
  };
}
