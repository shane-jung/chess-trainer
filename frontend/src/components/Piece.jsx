import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  selectActivePiece,
  selectLegalMoves,
  selectFen,
} from "../slices/game";
import useAction, {
  setActivePieceAction,
  setLegalMovesAction,
  handleMoveAction,
} from "../actions";

import pieces from "../pieces";
import calculateLegalMovesForPiece from "../calculateMoves";

export default function Piece({ piece: initial, index }) {
  // const board = useSelector(selectBoard);
  const fen = useSelector(selectFen);
  const activePiece = useSelector(selectActivePiece);
  const setActivePiece = useAction(setActivePieceAction);

  const legalMoves = useSelector(selectLegalMoves);
  const setLegalMoves = useAction(setLegalMovesAction);

  const handleMove = useAction(handleMoveAction);

  const [color, setColor] = useState(0b10000 & initial ? "w" : "b");
  const [type, setType] = useState(
    Object.keys(pieces).find((key) => pieces[key] === initial)
  );

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setColor(0b10000 & initial ? "w" : "b");
    setType(Object.keys(pieces).find((key) => pieces[key] === initial));
  }, [initial]);

  const handleMouseDown = (event) => {
    // console.log(turn, color);
    event.preventDefault();
    setActivePiece(index);
    setIsDragging(true);

    const piece = event.target.getBoundingClientRect();
    setOffset({
      x: piece.left + piece.width / 2,
      y: piece.top + piece.height / 2,
    });
    setPosition({
      x: event.clientX - piece.left - piece.width / 2,
      y: event.clientY - piece.top - piece.height / 2,
    });

    // console.log("FEN PIECES", FEN);
    console.log("Calculating");
    setLegalMoves(calculateLegalMovesForPiece(fen, index));
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    setPosition({
      x: -offset.x + event.clientX,
      y: -offset.y + event.clientY,
    });
  };

  const handleMouseUp = (event) => {
    setIsDragging(false);
    const boardRect = document.getElementById("board").getBoundingClientRect();
    const rank = 7-Math.floor((event.clientY - boardRect.top) / 70);
    const file = Math.floor((event.clientX - boardRect.left) / 70);
    // console.log(rank, file);
    const to = rank * 8 + file;

    if (fen.turn !== color) {
      premove();
      setPosition({ x: 0, y: 0 });
      return;
    }

    if (!legalMoves.includes(to)) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    handleMove(index, to);
  };

  function premove() {
    console.log("premove");
  }

  return (
    <img
      style={{ left: position.x, top: position.y }}
      className={"piece" + (activePiece === index ? " active" : "")}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      src={`pieces/${color?.toLowerCase()}${type?.toUpperCase()}.svg`}
      alt="Chess Piece"
    />
  );
}
